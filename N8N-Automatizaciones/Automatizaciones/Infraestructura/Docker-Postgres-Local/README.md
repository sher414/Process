# Migración de n8n a Docker + PostgreSQL (entorno production-grade local)

![Status](https://img.shields.io/badge/status-funcionando-brightgreen) ![Docker](https://img.shields.io/badge/docker-compose-blue) ![n8n](https://img.shields.io/badge/n8n-self--hosted-orange)

## Descripción

Migración de una instancia de n8n corriendo directo sobre Windows (npm + SQLite) a una arquitectura containerizada con **Docker Compose + PostgreSQL**, replicando localmente los mismos patrones que usaría un despliegue real en producción (separación de servicios, volúmenes persistentes, healthchecks, gestión de credenciales fuera del código).

Sobre esa infraestructura se validó de punta a punta el workflow **"Sistema de Leads Inteligentes"**: captura de leads por webhook, enriquecimiento automático, scoring, persistencia en Google Sheets y notificación por email condicional.

## Tabla de contenidos

- [Por qué esta arquitectura](#por-qué-esta-arquitectura)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Workflow: Sistema de Leads Inteligentes](#workflow-sistema-de-leads-inteligentes)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Aprendizajes y troubleshooting](#aprendizajes-y-troubleshooting)
- [Alcance: qué es y qué no es esto](#alcance-qué-es-y-qué-no-es-esto)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Por qué esta arquitectura

Una instalación de n8n vía `npm` con SQLite funciona bien para prototipar, pero tiene un techo real: SQLite no maneja bien escrituras concurrentes, y si el proceso se cae, hay que reinstalar y reconfigurar todo desde cero. Este proyecto resuelve ambos problemas:

- **PostgreSQL** en vez de SQLite → soporta conexiones concurrentes, es la base que usa cualquier instalación de n8n en producción real.
- **Contenedores con volúmenes externos** → el contenedor es descartable; los datos (workflows, credenciales, base de datos) viven fuera y sobreviven a un reinicio o una actualización de imagen.
- **Healthchecks + `depends_on`** → n8n no arranca hasta que Postgres está realmente listo para aceptar conexiones, no solo "iniciado".

## Prerrequisitos

- Windows 10/11 con [WSL2](https://learn.microsoft.com/windows/wsl/install) habilitado
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (usando el backend WSL2, no Hyper-V)
- Puerto `5678` libre en el host

## Instalación

1. Cloná este repo (o copiá la carpeta del proyecto) y ubicate dentro de ella.
2. Verificá que Docker esté corriendo:
   ```bash
   docker --version
   docker run hello-world
   ```
3. Copiá la plantilla de variables de entorno y completá con tus propios valores:
   ```bash
   cp .env.example .env
   ```
4. Levantá los servicios:
   ```bash
   docker-compose up -d
   ```
5. Confirmá que ambos contenedores estén saludables:
   ```bash
   docker ps
   ```
   Deberías ver `n8n-postgres` (Up, healthy) y `n8n-local` (Up).

## Uso

Con los contenedores arriba, n8n queda disponible en:

```
http://localhost:5678
```

Para detener sin perder datos:
```bash
docker-compose stop
```

Para volver a levantar:
```bash
docker-compose start
```

## Workflow: Sistema de Leads Inteligentes

**Qué resuelve:** captura leads entrantes por webhook, los enriquece automáticamente con datos de la empresa, calcula un score de calidad y notifica solo cuando el lead vale la pena seguir — sin que nadie tenga que revisar planillas a mano.

**Valor:** elimina la calificación manual de leads (revisar uno por uno si vale la pena contactar) y asegura que el equipo comercial solo reciba notificación de los leads con mayor probabilidad de conversión (categoría "Hot"). Ejemplo representativo de automatización de calificación de leads con n8n + APIs de enriquecimiento.

**Trigger:** Webhook (POST) — se dispara cuando llega un nuevo lead desde un formulario o sistema externo.

### Pasos del flujo

| # | Nodo | Tipo | Qué hace |
|---|------|------|----------|
| 1 | Webhook | Webhook | Recibe el POST con los datos crudos del lead (nombre, email, empresa, teléfono, origen) |
| 2 | ValidateLeadData | Code | Valida formato y completitud de los datos recibidos |
| 3 | CheckDuplicate | Code | Verifica si el email ya existe para evitar procesar el mismo lead dos veces |
| 4 | CallEnrichmentAPI | HTTP Request | Consulta Clearbit Autocomplete para resolver el dominio de la empresa |
| 5 | IF_EnrichmentSuccess | IF | Continúa según si el enriquecimiento devolvió datos válidos |
| 6 | ParseEnrichment | Code | Normaliza la respuesta del enriquecimiento |
| 7 | CalculateLeadScore | Code | Calcula un puntaje 0-100 según origen, dominio encontrado y completitud de datos; clasifica en Cold / Warm / Hot |
| 8 | Append or update row in sheet | Google Sheets | Persiste el lead (con score y categoría) en la planilla |
| 9 | IF_HighQuality | IF | Filtra solo los leads categoría Hot |
| 10 | Send an email | SendGrid | Notifica al equipo comercial cuando llega un lead Hot |

### Lógica de scoring (CalculateLeadScore)

| Factor | Puntos |
|---|---|
| Origen: webinar | +30 |
| Origen: referral | +25 |
| Origen: landing | +20 |
| Origen: manual | +10 |
| Dominio de empresa encontrado (Clearbit) | +20 |
| Email personal detectado | −15 |
| Por cada campo completo (empresa, teléfono, dominio, company) | +5 c/u |

Clasificación: `≥70` Hot · `≥40` Warm · `<40` Cold

### Credenciales y variables

| Variable / Credencial | Descripción | Valor de ejemplo |
|------------------------|-------------|-------------------|
| Google Sheets (Service Account) | Escribe/actualiza filas en la planilla de leads | `n8n-sheets@<proyecto>.iam.gserviceaccount.com` |
| SendGrid API Key | Envía la notificación de lead Hot | `SG.xxxxx...` |
| `DB_POSTGRESDB_*` | Conexión de n8n a PostgreSQL (definidas en `docker-compose.yml`) | ver Estructura de carpetas |

> ⚠️ El Service Account de Google necesita permiso **Editor** explícito sobre la planilla destino (Compartir → agregar el email del Service Account).
> ⚠️ El remitente de SendGrid debe estar verificado (Single Sender Verification) o el envío falla con 403/400.

### Cómo importarlo

1. En n8n: **Import from File** y elegí el JSON del workflow.
2. Configurá las credenciales de Google Sheets (Service Account) y SendGrid.
3. Reemplazá el ID de la planilla de Google Sheets por el propio.
4. Activá el workflow (toggle "Active") para usar la Production URL del webhook.

### Notas y limitaciones

- El scoring es una regla de negocio simple (suma de puntos); no incluye machine learning ni aprendizaje sobre conversiones reales.
- `CheckDuplicate` filtra por email exacto; no detecta variaciones (ej. mismo lead con emails distintos).
- No hay reintentos automáticos si SendGrid o Clearbit fallan — para producción real conviene agregar manejo de errores (`Error Trigger` + reintento).

## Estructura de carpetas

```
.
├── docker-compose.yml       # Definición de los servicios n8n + postgres (lee variables desde .env)
├── .env.example             # Plantilla de variables de entorno (se sube al repo)
├── .env                     # Variables reales con secretos (NO se sube, ver .gitignore)
├── .gitignore                # Excluye .env y los volúmenes de datos
├── data/                    # Volumen persistente de n8n (workflows, config, credenciales)
├── postgres-data/           # Volumen persistente de PostgreSQL
└── workflows/
    └── sistema-leads-inteligentes.json
```

## Aprendizajes y troubleshooting

Problemas reales encontrados durante la migración, documentados para que sirvan de referencia:

- **Notepad guardando archivos vacíos:** crear `docker-compose.yml` con Notepad puede resultar en un archivo de 0 bytes si el guardado no se confirma. Solución: crear el archivo directo desde PowerShell con un here-string (`@"..."@ | Out-File -Encoding utf8`), evitando el editor gráfico.
- **Healthcheck de Postgres fallando en el primer arranque:** la inicialización del cluster de Postgres (crear usuario, generar la base) puede tardar más que el timeout por defecto del healthcheck, marcándolo como "unhealthy" antes de que termine. Solución: agregar `start_period` al healthcheck para dar margen extra solo en el arranque inicial. Los arranques posteriores son mucho más rápidos porque no reinicializan el cluster.
- **Conflicto de puerto 5678:** no se puede correr la instancia `npm` y la de Docker al mismo tiempo (mismo puerto). Se resuelve identificando el proceso con `netstat -ano | findstr :5678` y cerrándolo con `taskkill /PID <pid> /F` antes de levantar el contenedor.
- **Test URL vs Production URL de webhooks:** la Test URL de un webhook en n8n solo escucha una llamada después de apretar "Execute workflow"; para pruebas repetidas o uso real, hay que activar el workflow y usar la Production URL, que queda escuchando de forma permanente.
- **Placeholders sin completar:** un JSON de workflow "plantilla" (pensado para compartir sin exponer datos propios) puede traer campos como `<TU_SHEET_ID>` o `<TU_EMAIL>` sin reemplazar — hay que revisar cada nodo con credenciales/IDs antes de ejecutar.
- **Debug de scoring por código, no por prueba y error:** en vez de adivinar qué combinación de datos daba categoría "Hot", se leyó directamente el código del nodo `CalculateLeadScore` para calcular el payload exacto necesario — más rápido y confiable que iterar a ciegas.

## Alcance: qué es y qué no es esto

Es importante ser preciso sobre el nivel de madurez de este entorno:

**Lo que sí tiene de production-grade:**
- PostgreSQL real en vez de SQLite (soporta concurrencia)
- Contenedores con volúmenes persistentes separados del proceso
- Orquestación con healthchecks y dependencias entre servicios
- Gestión de credenciales fuera del código (credential manager de n8n, no hardcodeadas en el workflow)
- Secretos de infraestructura (passwords de base de datos) separados del código vía `.env`, excluido del control de versiones

**Lo que todavía NO tiene (fuera de alcance de esta etapa):**
- Corre en una máquina local, no en un servidor con disponibilidad garantizada
- Sin HTTPS/certificado real (accesible solo por `http://localhost`)
- Sin backups automatizados ni monitoreo
- Sin modo queue / Redis para manejar alto volumen de ejecuciones concurrentes

Este proyecto es el paso intermedio entre "n8n corriendo en mi máquina" y un despliegue real en un VPS con dominio propio — replica la arquitectura sin el costo ni el riesgo de un servidor productivo mientras se termina de aprender cada pieza.

## Contribuir

Sugerencias y mejoras son bienvenidas vía issues o pull requests.

## Licencia

MIT
