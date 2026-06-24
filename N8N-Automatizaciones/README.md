# 🔄 N8N — Automatizaciones e IA Aplicada

Sección del repositorio dedicada a la automatización de procesos con **n8n**, integrando inteligencia artificial, APIs y servicios de Google Workspace. Reúne proyectos prácticos, laboratorios de aprendizaje y material de estudio.

---

## 📁 Estructura

### 📂 [Automatizaciones](./Automatizaciones)

Proyectos end-to-end y workflows listos para usar:

| Proyecto | Descripción | Stack |
|----------|-------------|-------|
| [🤖 Agente de Productividad Semanal](./Automatizaciones/Agente%20de%20productividad%20semanal) | Genera planes de trabajo personalizados vía formulario + IA (Gemini) | n8n · Gemini · Forms |
| [📧 Clasificador Automático de Mails](./Automatizaciones/ClasificadorAutomaticoMails) | Clasifica emails entrantes con IA en 6 campos estructurados; idempotente con hash MD5 | n8n · Gemini · Gmail |
| [📊 ETL Ventas & Presupuesto → Power BI](./Automatizaciones/ETL_Ventas_Presupuesto_PowerBI) | Pipeline ETL semanal: extrae, transforma, calcula KPIs y carga en DW liviano + notifica en Slack | n8n · Sheets · Power BI · Slack |
| [🎫 Soporte y Seguimiento de Pedidos](./Automatizaciones/Soporte-Pedidos) | Sistema de tickets automático: detecta emails de clientes, los clasifica con IA y responde en segundos | n8n · Gemini · Gmail |
| [💬 CSAT Telegram Chatbot](./Automatizaciones/Telegram-CSAT-ChatBOT) | Bot de atención al cliente con IA en Telegram: asiste reclamos, genera número de caso y lanza encuesta NPS | n8n · Gemini · Telegram · Sheets |
| [🎙️ Transcriptor de Audio → Contrato PDF](./Automatizaciones/TranscribirAudioTelegram) | El usuario manda un audio por Telegram y recibe el contrato PDF generado automáticamente | n8n · Whisper · Gemini · Telegram |
| 🔍 Chat Gemini Extract Info | Extracción de información estructurada desde texto libre con Gemini | n8n · Gemini |
| 🖥️ Desafío 2 — Monitor Drive + Bitácora IA | Monitoreo de Google Drive con registro automático de actividad asistido por IA | n8n · Drive · Gemini |
| 📄 HTTP Request + GAS → PDF | Generación de PDF vía HTTP Request + Google Apps Script | n8n · Apps Script |
| ✅ Tareas Post-Reunión con IA | Extrae action items desde transcripciones de reuniones y crea tarjetas en Trello y Asana | n8n · Gemini · Trello · Asana |
| 📱 WhatsApp — Agenda — Vibecoding | Gestión de agenda vía WhatsApp integrada con IA | n8n · WhatsApp · Gemini |

#### Workflows individuales (sin carpeta propia)

- `inscripcion-evento.json` — inscripción automática a eventos
- `Saldo_Bancario_Bajo.json` — alerta de saldo bancario bajo

---

### 📂 [LABS](./LABS)

Laboratorios de práctica — flujos construidos paso a paso para aprender y experimentar:

- LAB 01 — Flujo de captación de leads
- LAB 02 — Workflow productivo

### 📂 [Recursos](./Recursos)

Material de estudio y referencia sobre IA aplicada y agentes.

---

## 🎯 Objetivo de esta sección

Demostrar capacidad para diseñar e implementar automatizaciones reales que conectan múltiples sistemas, incorporan IA y resuelven problemas concretos de negocio — sin depender de desarrollo de código tradicional.

## 🛠️ Stack

- **n8n** (Cloud y self-hosted)
- **IA / LLMs** — Gemini 2.5 Flash, Whisper (transcripción de audio)
- **Google Workspace** — Drive, Sheets, Forms, Gmail, Apps Script
- **Mensajería** — Telegram, WhatsApp
- **Gestión de proyectos** — Trello, Asana
- **APIs y HTTP Requests** — integración con servicios externos
- **Webhooks** — disparadores en tiempo real
- **Power BI** — visualización de datos y dashboards

---

*Parte del repositorio [Process](../) · Germán — Industrial Engineer · Digital Transformation · Process Automation*
