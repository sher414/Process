# 🤖 Agente de Productividad Semanal con n8n + IA

> Automatización construida con n8n que genera planes de trabajo personalizados usando IA (Gemini). Prototipo funcional en localhost.

---

## 📋 ¿Qué hace este flujo?

El usuario completa un formulario con su rol, objetivos semanales, bloqueos de tiempo y horas disponibles. La IA genera automáticamente un plan de tareas diario detallado y equilibrado, respetando las restricciones del usuario.

---

## 🧩 Arquitectura del flujo

```
On Form Submission
        ↓
   IF — Validación
   (horas > 0 AND horas ≤ 24)
      /            \
   TRUE           FALSE
     ↓               ↓
Basic LLM Chain   Form Ending
(Gemini)          (Error)
     ↓
Form Ending
(Plan semanal en tabla Markdown)
```

---

## 📥 Campos del formulario

| Campo | Tipo | Requerido |
|---|---|---|
| `rol_principal` | Dropdown | ✅ |
| `objetivo_lunes` | Text | ✅ |
| `objetivo_martes` al `viernes` | Text | ❌ |
| `bloqueos_de_tiempo` | Textarea | ✅ |
| `horas_laborales_diarias` | Number (1-24) | ✅ |

---

## 🤖 Prompt del agente

- **Técnica Persona:** Especialista en productividad y bienestar laboral
- **Variables dinámicas:** rol, objetivos, bloqueos, horas
- **Restricciones lógicas:** respeta bloqueos y límite de horas
- **Formato de salida:** tabla Markdown con columnas Día, Bloque de Tiempo y Tarea

---

## 🚀 Del prototipo a Producción

### 🔧 Infraestructura
- Servidor dedicado o cloud (AWS / GCP / Azure)
- n8n self-hosted con Docker o n8n Cloud
- Dominio propio con HTTPS/SSL
- Variables de entorno para API keys (no hardcodeadas)

### 🔐 Seguridad
- Autenticación en el formulario (no público)
- Rate limiting para evitar abuso
- Encriptación de datos sensibles
- Gestión de secrets con herramientas como Vault

### 📊 Monitoreo
- Logs centralizados
- Alertas ante fallos del flujo
- Dashboard de ejecuciones

### 💾 Persistencia
- Guardar los planes generados en una DB
- Historial por usuario
- Integración con Google Sheets o Notion

### 👥 Escalabilidad
- Queue para múltiples usuarios simultáneos
- Límites de uso por usuario
- SLA del modelo de IA

---

## 🛠️ Stack utilizado

- **n8n** — Motor de automatización
- **Google Gemini** — Modelo de IA generativa
- **n8n Form Trigger** — Entrada de datos
- **Basic LLM Chain** — Nodo de procesamiento IA

---

## 👤 Autor

💼 Estoy dando mis primeros pasos en automatización y transformación digital, y busco activamente proyectos donde pueda aportar valor con estas herramientas.

Si tu empresa o equipo está pensando en automatizar procesos, optimizar flujos de trabajo o explorar el potencial de la IA aplicada al negocio, ¡me encantaría conectar y charlar!

📩 Abierto a proyectos freelance, colaboraciones y oportunidades de transformación digital.

---

#n8n #automatizacion #TransformacionDigital #InteligenciaArtificial #NoCode #LowCode #Productividad #BusquedaActiva #OpenToWork #Freelance #IA #Innovacion #Argentina #DesarrolloProfesional
