# ETL Ventas & Presupuesto → Power BI Dashboard

![Status](https://img.shields.io/badge/status-completado-brightgreen)
![n8n](https://img.shields.io/badge/n8n-workflow-orange)
![Power BI](https://img.shields.io/badge/Power%20BI-dashboard-yellow)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-destino-34A853)

Pipeline ETL semanal automatizado con **n8n** que extrae datos de ventas y presupuesto desde Google Sheets, los transforma aplicando correcciones y calculando KPIs, y los carga en un Data Warehouse liviano listo para ser consumido por **Power BI Desktop**.

---

## Tabla de contenidos

- [¿Qué resuelve?](#qué-resuelve)
- [Arquitectura del pipeline](#arquitectura-del-pipeline)
- [Prerrequisitos](#prerrequisitos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Workflow n8n](#workflow-n8n)
- [Dashboard Power BI](#dashboard-power-bi)
- [Cómo importar y correr el workflow](#cómo-importar-y-correr-el-workflow)
- [Credenciales y variables](#credenciales-y-variables)
- [KPIs calculados](#kpis-calculados)
- [Aprendizajes y decisiones de diseño](#aprendizajes-y-decisiones-de-diseño)
- [Notas y limitaciones](#notas-y-limitaciones)

---

## ¿Qué resuelve?

Una distribuidora de alimentos tenía sus datos de ventas y presupuesto en hojas de cálculo separadas. Cada lunes, alguien consolidaba los datos manualmente para generar el reporte de la semana — un proceso de **45 a 60 minutos** propenso a errores y dependiente de una persona.

Este pipeline automatiza ese proceso de punta a punta:

- **Extrae** ventas y presupuesto en paralelo desde Google Sheets
- **Corrige** errores de origen (campos región/vendedor invertidos)
- **Cruza** ventas con presupuesto por zona, producto y mes
- **Calcula** margen y % de ejecución vs presupuesto
- **Carga** los resultados en un Data Warehouse liviano (Google Sheets)
- **Notifica** al equipo en Slack cuando el proceso termina
- **Alimenta** un dashboard de Power BI listo para presentar

> Ejemplo representativo de un pipeline ETL con n8n, Google Sheets como DW liviano y Power BI como capa de visualización.

---

## Arquitectura del pipeline

```
┌─────────────────────┐     ┌─────────────────────┐
│   BD_VENTAS         │     │   PRESUPUESTO        │
│   (174 filas)       │     │   (100 filas)        │
│   Google Sheets     │     │   Google Sheets      │
└────────┬────────────┘     └──────────┬───────────┘
         │  Extract (paralelo)         │
         └──────────┬──────────────────┘
                    ▼
           ┌────────────────┐
           │  Merge_Fuentes │  274 ítems combinados
           │  (Append)      │
           └───────┬────────┘
                   ▼
           ┌────────────────┐
           │   Transform    │  Separar · Corregir · Calcular KPIs
           │  (Code node)   │  → 174 ítems limpios
           └───────┬────────┘
                   ▼
           ┌────────────────┐
           │ Load:fact_ventas│  Append a Google Sheets DW
           │ (Google Sheets) │
           └───────┬────────┘
                   ▼
           ┌────────────────┐     ┌──────────────────┐
           │Agrupar_resultado│────▶│  Post a Slack    │
           │  (Aggregate)   │     │  (HTTP Request)  │
           └────────────────┘     └──────────────────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │  Power BI     │
                                  │  Dashboard    │
                                  └───────────────┘
```

**Trigger:** Schedule — todos los lunes a las 08:00 (America/Argentina/Buenos_Aires)

---

## Prerrequisitos

- **n8n** instalado (local o cloud) — versión compatible con `typeVersion 4.7` de Google Sheets
- **Cuenta de Google Cloud** con Service Account habilitada para Google Sheets API
- **Google Sheets** — una hoja fuente y una hoja destino
- **Power BI Desktop** instalado (gratuito desde Microsoft Store o powerbi.microsoft.com)
- **Slack** — workspace con un canal y una app Incoming Webhook configurada (opcional)

---

## Estructura del proyecto

```
ETL_Ventas_Presupuesto_PowerBI/
│
├── README.md                                     # Este archivo
│
├── workflow/
│   ├── ETL_Ventas_Presupuesto_PowerBI.json       # Workflow n8n exportado
│   ├── ETL_Distribuidora_Dashboard.pbix          # Dashboard Power BI
│   ├── distribuidora_ETL_datos.xlsx              # Datos fuente (BD_VENTAS + PRESUPUESTO)
│   ├── DW_ETL_Distribuidora.xlsx                 # Datos destino (fact_ventas)
│   └── Transform                                 # Código JavaScript del nodo Transform
│
└── assets/
    ├── ETL_workflow_n8n.png              # Canvas del workflow en n8n
    ├── ETL_Excel_Distribuidora_datos.png # Hoja fuente BD_VENTAS
    ├── ETL_Excel_Distribuidora.png       # Hoja destino DW fact_ventas
    ├── Dashboard_Visualizaciones_PBI.png # Dashboard Power BI
    └── Slack_alertas.png                 # Notificaciones en Slack
```

---

## Workflow n8n

**Qué resuelve:** automatiza la consolidación semanal de ventas vs presupuesto, eliminando la carga manual de ~60 minutos cada lunes.

**Trigger:** Schedule Trigger — lunes 08:00 AM (America/Argentina/Buenos_Aires)

### Pasos del flujo

| # | Nodo | Tipo | Qué hace |
|---|------|------|----------|
| 1 | Rutina Lunes 8AM | Schedule Trigger | Dispara el pipeline todos los lunes a las 08:00 |
| 2 | Extract_BD_VENTAS | Google Sheets (Read) | Lee 174 filas de ventas desde la hoja BD_VENTAS |
| 3 | Extract_PRESUPUESTO | Google Sheets (Read) | Lee 100 filas de presupuesto en paralelo |
| 4 | Merge_Fuentes | Merge (Append) | Combina ambas fuentes → 274 ítems mezclados |
| 5 | Transform | Code (JavaScript) | Separa, corrige y transforma los datos (ver detalle abajo) |
| 6 | Load: fact_ventas | Google Sheets (Append) | Carga las 174 filas transformadas en el DW destino |
| 7 | Agrupar_resultado | Aggregate | Agrupa los 174 ítems en 1 para el mensaje de Slack |
| 8 | Post a Slack | HTTP Request (POST) | Notifica al canal #etl-alertas que el proceso terminó |

### Detalle del nodo Transform (Code)

Este es el corazón del ETL. El nodo JavaScript hace cuatro cosas:

**1. Separar ventas de presupuestos** usando el campo identificador de cada fuente (`venta_id` vs `pres_id`).

**2. Construir un lookup dictionary** de presupuesto con clave compuesta `zona_id + producto_id + mes`:
```javascript
const key = `${p.zona_id}_${p.producto_id}_${p.mes}`;
// Ejemplo: "Z001_P003_6" → 36786
presLookup[key] = p.importe_presupuestado;
```

**3. Corregir campos invertidos** en la fuente BD_VENTAS (error de origen detectado durante el desarrollo):
```javascript
const region_correcta  = v.vendedor;  // "GBA Norte" estaba en el campo vendedor
const vendedor_correcto = v.region;   // "Carlos Méndez" estaba en el campo region
```

**4. Calcular KPIs** por cada venta:
```javascript
// Margen
const margen = parseFloat((v.importe_venta - (v.costo_unitario * v.cantidad)).toFixed(2));

// % ejecución vs presupuesto (con null safety para evitar división por cero)
const pct_vs_presupuesto = presupuesto
  ? parseFloat(((v.importe_venta / presupuesto) * 100).toFixed(2))
  : null;
```

### Notificación Slack

Al finalizar, el workflow postea al canal `#etl-alertas`:

```
✅ ETL Distribuidora completado
📅 Fecha: 23/06/2026 08:02
📊 Registros cargados: 174
🏭 Fuente: BD_VENTAS + PRESUPUESTO
📁 Destino: DW_ETL_Distribuidora → fact_ventas

Power BI ya puede refrescar el dashboard. 🚀
🔗 Ver canal ETL Distribuidora
```

---

## Dashboard Power BI

El archivo `.pbix` se conecta al Google Sheet destino via URL de exportación CSV:

```
https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=0
```

> ⚠️ El Sheet destino debe tener permisos de lectura pública para que Power BI pueda conectarse con autenticación anónima.

### Visualizaciones incluidas

| Visual | Dimensión | Métrica | Insight principal |
|--------|-----------|---------|-------------------|
| Barras horizontales | Categoría | Suma de importe_venta | Aceites es la categoría líder en ventas |
| Línea de tendencia | Mes | Promedio pct_vs_presupuesto | Junio superó el presupuesto (102%); julio bajó al 91% |
| Barras horizontales | Vendedor | Suma de margen | Carlos Méndez lidera el margen generado |

![Dashboard Power BI](assets/Dashboard_Visualizaciones_PBI.png)

---

## Cómo importar y correr el workflow

### 1. Importar el workflow en n8n

```
n8n → menú lateral → Workflows → Import from File
→ seleccionar ETL_Ventas_Presupuesto_PowerBI.json
```

### 2. Configurar credenciales

Ir a **Settings → Credentials** y crear:

- **Google Sheets (Service Account):** subir el JSON de la Service Account de Google Cloud y asignarla a los nodos Extract y Load.
- **Slack Webhook:** reemplazar la URL del nodo `Post a Slack` con tu propio Incoming Webhook.

### 3. Actualizar los IDs de las hojas

En los nodos de Google Sheets, reemplazar los IDs por los tuyos:

| Nodo | Sheet ID |
|------|----------|
| Extract_BD_VENTAS | ID de la hoja fuente |
| Extract_PRESUPUESTO | ID de la hoja fuente |
| Load: fact_ventas | ID de la hoja destino (DW) |

### 4. Conectar Power BI

```
Power BI Desktop → Inicio → Obtener datos → Web
→ pegar la URL de exportación CSV del Sheet destino
→ Anónimo → Conectar → Cargar
```

### 5. Activar el workflow

```
Toggle "Active" en la esquina superior derecha del canvas
```

El workflow correrá automáticamente todos los lunes a las 08:00.

---

## Credenciales y variables

| Variable / Credencial | Descripción | Referencia |
|-----------------------|-------------|------------|
| Google Sheets Service Account | Credencial de máquina para acceso a Google Sheets sin flujo OAuth2 | `<nombre>@<proyecto>.iam.gserviceaccount.com` |
| Sheet ID — Fuente | ID del Google Sheet con BD_VENTAS y PRESUPUESTO | `<tu-sheet-id-fuente>` |
| Sheet ID — Destino | ID del Google Sheet DW (fact_ventas) | `<tu-sheet-id-destino>` |
| Slack Webhook URL | URL del Incoming Webhook para notificar al canal | `https://hooks.slack.com/services/<TOKEN>` |

> 🔒 **Nunca expongas el Webhook URL de Slack ni el JSON de la Service Account en el repositorio.** Usá variables de entorno o el gestor de credenciales de n8n.

---

## KPIs calculados

| KPI | Fórmula | Descripción |
|-----|---------|-------------|
| `margen` | `importe_venta − (costo_unitario × cantidad)` | Margen bruto por venta en pesos |
| `pct_vs_presupuesto` | `(importe_venta / importe_presupuestado) × 100` | % de ejecución respecto al presupuesto asignado por zona, producto y mes |
| `semana` | `Math.ceil(dia / 7)` | Semana del mes (1 a 5) para granularidad semanal en PBI |
| `trimestre` | `Q1 / Q2 / Q3 / Q4` | Trimestre calculado desde el mes de la venta |

---

## Aprendizajes y decisiones de diseño

Estos son los aprendizajes reales que emergieron durante el desarrollo, documentados como valor de portfolio:

**Service Account vs OAuth2**
Se eligió autenticación via Service Account en lugar de OAuth2 para eliminar la dependencia del flujo de consentimiento humano y la URL de callback — apropiado para un proceso desatendido (server-to-server). OAuth2 fallaba repetidamente con `redirect_uri_mismatch` en entorno de testing con ngrok.

**Fan-out en el nodo Merge**
El Merge en modo Append produce 274 ítems mezclados (174 ventas + 100 presupuestos). El nodo Transform los separa por campo identificador antes de procesar — patrón más robusto que hacer dos ramas separadas desde el trigger.

**Lookup dictionary para cruzar presupuesto**
En lugar de un JOIN, se construyó un diccionario JavaScript con clave compuesta `zona_id_producto_id_mes`. Más eficiente y explícito que recorrer el array de presupuestos por cada venta.

**Corrección de campos invertidos en el ETL**
La fuente BD_VENTAS tenía `region` y `vendedor` intercambiados. Se corrigió en el Transform, no en la fuente — el ETL no solo mueve datos, también los corrige y deja registro de la corrección.

**Null safety en división**
`pct_vs_presupuesto` devuelve `null` si no existe presupuesto para esa combinación zona/producto/mes — evita división por cero y permite filtrar en PBI.

**Conexión PBI via CSV export**
Conectar Power BI via URL de exportación CSV es más simple que usar el conector oficial de Google Sheets (que requiere cuenta Microsoft 365). Limitación: requiere que el Sheet sea público para lectura.

---

## Notas y limitaciones

- El nodo `Limpiar_fact_ventas` (Clear) está presente en el workflow pero actualmente desconectado del flujo principal. Por diseño, la carga actual es acumulativa (Append). Para implementar el patrón idempotente completo (Clear + Append), reconectar: `Transform → Limpiar_fact_ventas → Load: fact_ventas`.
- El dashboard de Power BI requiere actualización manual (F5 o "Actualizar") para reflejar los datos del último ETL. Power BI Pro permitiría actualización programada automática.
- Los datos de ejemplo cubren junio y julio de 2025 (dos meses). El pipeline está preparado para acumular meses adicionales en cada ejecución.
- El Sheet destino debe tener permisos de lectura pública para la conexión anónima de PBI — evaluar implicancias de seguridad antes de usar con datos reales de producción.

---

## Licencia

MIT — libre para usar, modificar y distribuir con atribución.
