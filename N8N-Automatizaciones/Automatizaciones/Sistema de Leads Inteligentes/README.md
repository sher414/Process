# 🎯 Sistema de Leads Inteligente — Etapa 5

![Status](https://img.shields.io/badge/status-active-brightgreen)
![n8n](https://img.shields.io/badge/built%20with-n8n-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

Pipeline completo de captura, enriquecimiento y scoring de leads construido en n8n. Automatiza el proceso de recepción de leads desde un webhook, los valida, enriquece con datos de empresa y los puntúa con un algoritmo propio, para luego guardarlos en Google Sheets y notificar por email los leads de alta calidad.

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Workflow](#workflow-sistema-de-leads-inteligente)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Notas y limitaciones](#notas-y-limitaciones)
- [Licencia](#licencia)

---

## Descripción

Este proyecto es un ejemplo representativo de un sistema de gestión de leads automatizado. Resuelve el problema de procesar manualmente los contactos que llegan desde formularios web: validación de datos, detección de duplicados, enriquecimiento con información de empresa y clasificación por calidad.

**Impacto estimado:** elimina entre 15 y 30 minutos diarios de carga manual de leads, evita duplicados en la base de datos y asegura que el equipo comercial solo reciba notificaciones de leads realmente calificados.

---

## Arquitectura

```
Webhook (POST)
    ↓
ValidateLeadData      → valida campos obligatorios y normaliza datos
    ↓
CheckDuplicate        → evita reprocesar el mismo email en 30 días
    ↓
CallEnrichmentAPI     → consulta Clearbit Autocomplete (sin API key)
    ↓
IF_EnrichmentSuccess  → ¿Clearbit devolvió datos?
    ↓ Sí
ParseEnrichment       → combina datos del lead + datos de Clearbit
    ↓
CalculateLeadScore    → puntaje 0–100 por reglas de negocio
    ↓
Google Sheets         → guarda o actualiza el lead (match por email)
    ↓
IF_HighQuality        → ¿score ≥ 70?
    ↓ Sí
SendGrid Email        → notificación de lead Hot al equipo comercial
```

---

## Requisitos previos

- [n8n](https://n8n.io/) corriendo localmente (`localhost:5678`) o en la nube
- [ngrok](https://ngrok.com/) para exponer el webhook públicamente (desarrollo local)
- Cuenta de [SendGrid](https://sendgrid.com/) gratuita con sender verificado
- Google Sheets con Service Account configurada en n8n
- Node.js 18+

---

## Instalación

1. Cloná el repositorio:
```bash
git clone https://github.com/sher414/Process.git
cd Process/N8N-Automatizaciones/Automatizaciones/Sistema_Leads_Inteligente
```

2. Importá el workflow en n8n:
   - Abrí n8n → menú lateral → **Import from File**
   - Seleccioná `workflow/Sistema_de_Leads_Inteligentes.json`

3. Configurá las credenciales (ver tabla abajo en la sección Workflow)

4. Activá el workflow con el toggle **Active** en n8n

5. Levantá ngrok apuntando al puerto 5678:
```bash
ngrok http --url=<tu-dominio-estatico>.ngrok-free.dev 5678
```

---

## Uso

Enviá un lead via POST al webhook:

```bash
curl -X POST https://<tu-dominio>.ngrok-free.dev/webhook/capture-lead \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María Pérez",
    "email": "maria@empresa.com",
    "empresa": "Amazon",
    "telefono": "+54911234567",
    "origen": "webinar",
    "notas": "Interesada en automatización"
  }'
```

**Campos del payload:**

| Campo | Tipo | Requerido | Valores válidos |
|-------|------|-----------|-----------------|
| `nombre` | string | ✅ | mín. 2 caracteres |
| `email` | string | ✅ | formato válido |
| `empresa` | string | ❌ | libre |
| `telefono` | string | ❌ | libre |
| `origen` | string | ❌ | `landing`, `referral`, `manual`, `webinar` |
| `notas` | string | ❌ | libre |

**Lógica de scoring:**

| Factor | Puntos |
|--------|--------|
| origen `webinar` | +30 |
| origen `referral` | +25 |
| origen `landing` | +20 |
| origen `manual` | +10 |
| Dominio de empresa encontrado por Clearbit | +20 |
| Email personal (Gmail, Hotmail, etc.) | -15 |
| Datos completos (empresa, teléfono, domain, company) | +5 por campo |

**Clasificación:**
- `Hot` → score ≥ 70 → notificación por email
- `Warm` → score 40–69
- `Cold` → score < 40

---

## Workflow: Sistema de Leads Inteligente

**Qué resuelve:** automatiza la recepción, validación, enriquecimiento y clasificación de leads comerciales entrantes, eliminando la carga manual y asegurando que el equipo comercial actúe solo sobre contactos calificados.

**Valor:** un equipo comercial sin este sistema dedica tiempo a revisar leads incompletos, duplicados o de baja calidad. Este pipeline filtra, enriquece y puntúa automáticamente, entregando solo los leads con score ≥ 70 via email en tiempo real. Ejemplo representativo de integración n8n + API externa + Google Sheets + SendGrid.

**Trigger:** HTTP POST al endpoint `/webhook/capture-lead`

### Pasos del flujo

| # | Nodo | Tipo | Qué hace |
|---|------|------|----------|
| 1 | Webhook | Webhook | Recibe el lead via POST en `/capture-lead`. Modo `Immediately` para responder sin nodo adicional |
| 2 | ValidateLeadData | Code | Valida nombre (mín. 2 chars), email (regex), origen (enum). Detecta emails personales y los marca como warning. Rechaza leads inválidos |
| 3 | CheckDuplicate | Code | Usa `$getWorkflowStaticData('global')` para registrar emails procesados. Si el email ya existe en los últimos 30 días, marca `isDuplicate: true` y continúa |
| 4 | CallEnrichmentAPI | HTTP Request | GET a `https://autocomplete.clearbit.com/v1/companies/suggest?query={{empresa}}`. Sin API key. `continueOnFail: true` para no romper el pipeline si falla |
| 5 | IF_EnrichmentSuccess | IF | Condición: `$json.name is not empty`. True → Clearbit devolvió datos. False → usar fallback (pendiente) |
| 6 | ParseEnrichment | Code | Combina datos del lead (recuperados desde `$('CheckDuplicate').first().json`) con el primer resultado de Clearbit (`name`, `domain`, `logo`) |
| 7 | CalculateLeadScore | Code | Calcula score 0–100 por reglas: origen, dominio encontrado, email personal, completitud de datos. Clasifica en Hot / Warm / Cold |
| 8 | Append or update row in sheet | Google Sheets | `appendOrUpdate` con match por columna `email`. Evita duplicados en el Sheet. Guarda: nombre, email, empresa, company, domain, origen, score, categoria, enrichmentMethod, receivedAt |
| 9 | IF_HighQuality | IF | Condición: `$json.score >= 70`. Solo los leads Hot pasan a notificación |
| 10 | Send an email | SendGrid | Envía email con datos del lead y score al equipo comercial. Solo se ejecuta si score ≥ 70 |

### Credenciales y variables

| Variable / Credencial | Descripción | Valor de ejemplo |
|-----------------------|-------------|------------------|
| Google Sheets account | Service Account con acceso Editor al Sheet de leads | `n8n-sheets@proyecto.iam.gserviceaccount.com` |
| SendGrid account | API Key de SendGrid con sender verificado | `SG.xxxxxxxxxxxx` |
| `WEBHOOK_URL` | URL pública del tunnel ngrok | `https://<subdominio>.ngrok-free.dev` |
| Sheet ID | ID del Google Sheet donde se guardan los leads | `14sugjeu29M4GAkWCF4LHwYak2rnmGtX-57eH-LLjEyw` |

> ⚠️ **Seguridad:** no expongas tu API Key de SendGrid ni el ID del Sheet en el repo. Usá variables de entorno o las credenciales encriptadas de n8n.

### Cómo importarlo

1. En n8n: **Import from File** → seleccioná `workflow/Sistema_de_Leads_Inteligentes.json`
2. En **Credentials**, configurá:
   - `Google Sheets account` → Service Account de Google Cloud
   - `SendGrid account` → API Key de tu cuenta SendGrid
3. Compartí tu Google Sheet con el email del Service Account (rol Editor)
4. Verificá el sender en SendGrid con tu email real
5. Activá el workflow

### Notas y limitaciones

- **Clearbit Autocomplete** es una API pública sin autenticación. Devuelve hasta 5 sugerencias de empresa. En producción conviene reemplazarla por Hunter.io, Clearbit Enrichment API o Apollo para obtener más datos (empleados, industria, cargo).
- **CheckDuplicate** usa `staticData` de n8n, que no persiste en modo test. Funciona correctamente con el workflow activo en producción.
- **Rama False del IF_EnrichmentSuccess** (cuando Clearbit falla) no está implementada en esta versión. El lead se pierde si la API no responde. Pendiente: agregar nodo `UseFallback` con datos heurísticos.
- **CircuitBreaker** está definido conceptualmente pero no conectado en esta versión del workflow. Pendiente conectarlo antes del nodo de enriquecimiento.
- El scoring es por reglas simples. No incluye scoring por IA (previsto en la Etapa 5 completa del curso educaciónIT).
- SendGrid puede enviar el primer email a la carpeta Spam. Verificar el dominio sender en SendGrid resuelve esto.

---

## Estructura del repositorio

```
Sistema_Leads_Inteligente/
├── workflow/
│   └── Sistema_de_Leads_Inteligentes.json   # Workflow exportado de n8n
├── assets/
│   ├── workflow_completo.png                 # Vista general del pipeline
│   ├── webhook_inicial.png                   # Configuración del Webhook
│   ├── checkduplicates.png                   # Nodo CheckDuplicate
│   ├── CallEnrichmentAPI.png                 # HTTP Request a Clearbit
│   ├── IfNode.png                            # IF de enriquecimiento
│   ├── CalculateLeadScore.png                # Código de scoring
│   ├── Leads_IA_sheet.png                    # Google Sheet resultante
│   ├── postman_post_request.png              # Ejemplo de request en Postman
│   └── Email_Sent_Lead_HOT.png              # Email recibido (lead Hot)
└── README.md
```

> ⚠️ Las capturas de los nodos SendGrid y Google Sheets no se incluyen en el repo por contener referencias a credenciales y IDs privados.

---

## Licencia

MIT © [Germán Pablo Morvillo](https://linkedin.com/in/german-pablo-morvillo)
