# 🔄 Automatizaciones en n8n

Colección de flujos de trabajo automatizados desarrollados en **n8n**, una plataforma de automatización low-code/no-code. Cada carpeta contiene un proyecto end-to-end con su workflow, integraciones y lógica de procesamiento.

---

## 📂 Proyectos

### 🗓️ Agente de productividad semanal
Agente automatizado que apoya la gestión de tareas y productividad semanal. Orquesta recordatorios, seguimiento de pendientes y organización del trabajo.

### 💬 Chat_Gemini_Extract_Info
Flujo que utiliza un modelo de IA (Gemini) para extraer y estructurar información a partir de conversaciones o texto no estructurado.

### 📁 Desafío2 - Monitor Drive + Bitácora IA
Automatización que monitorea cambios en Google Drive y genera una bitácora con asistencia de IA. Útil para auditoría y trazabilidad de archivos.

### 📄 HTTP_Request_GAS_PDF
Flujo que combina peticiones HTTP con Google Apps Script (GAS) para generar o procesar archivos PDF de forma automatizada.

### 📦 Soporte-Pedidos
Automatización orientada a la gestión y seguimiento de pedidos, integrando notificaciones y actualizaciones de estado.

---

## 📑 Workflows individuales (JSON)

| Archivo | Descripción |
|---------|-------------|
| `inscripcion-evento (1).json` | Flujo de inscripción a eventos: captura de datos y procesamiento automático |
| `Saldo_Bancario_Bajo.json` | Alerta automatizada que notifica cuando un saldo bancario baja de cierto umbral |

---

## 🚀 Cómo usar estos flujos

Los archivos `.json` son workflows exportados de n8n. Para importarlos:

1. Abrí tu instancia de n8n (Cloud o self-hosted)
2. Andá a **Workflows → Import from File** (o el menú de tres puntos → *Import*)
3. Seleccioná el archivo `.json` correspondiente
4. Revisá y configurá las **credenciales** requeridas (cada integración necesita sus propias claves: Google, Telegram, etc.)
5. Activá el workflow

> ⚠️ **Nota de seguridad:** Los workflows exportados no incluyen credenciales por seguridad. Vas a necesitar configurar tus propias claves de API en cada nodo que lo requiera.

---

## 🛠️ Tecnologías e integraciones utilizadas

- **n8n** — motor de automatización de flujos
- **IA aplicada** — Gemini / modelos de lenguaje para extracción y procesamiento de información
- **Google Workspace** — Drive, Sheets, Apps Script
- **HTTP Requests / APIs** — integración con servicios externos
- **Generación de PDF** — procesamiento documental automatizado

---

## 🧠 Habilidades demostradas

- Diseño de automatizaciones end-to-end con n8n
- Integración de IA en flujos de trabajo reales
- Conexión entre múltiples servicios (APIs, Google, documentos)
- Resolución de casos de uso concretos: productividad, finanzas, soporte, documentos

---

*Parte del repositorio [Process](../../) · Germán — Industrial Engineer · Digital Transformation · Process Automation*
