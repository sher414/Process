# 🤖 Desafio2 - Monitor Drive + Bitácora IA

Workflow construido en **n8n** como parte del proceso de aprendizaje en automatización e IA aplicada.

---

## 📋 Descripción

Este flujo monitorea automáticamente una carpeta de **Google Drive** en busca de nuevos reportes. Cuando detecta un archivo nuevo, extrae su contenido, lo procesa con un **Agente de IA (Google Gemini)** y vuelca un resumen estructurado en un **Google Doc** que actúa como bitácora centralizada.

---

## 🎯 Caso de uso

Equipos que reciben reportes periódicos (ventas, operaciones, logística) y necesitan:
- Un resumen ejecutivo automático de cada reporte
- Un registro centralizado y ordenado de todos los análisis
- Cero intervención manual en el proceso de síntesis

---

## 🔁 Arquitectura del flujo

```
[Schedule Trigger]
       ↓ (cada 1 hora)
[Google Drive - Search Files]
       ↓ (busca archivos en carpeta Reportes_IA)
[Google Drive - Download File]
       ↓ (descarga el contenido binario)
[Extract from Text File]
       ↓ (convierte binario a texto plano)
[AI Agent - Google Gemini 2.5 Flash Lite]
       ↓ (genera resumen estructurado en JSON)
[Code - JavaScript]
       ↓ (limpia y parsea el JSON)
[Google Docs - Update Document]
       ↓ (escribe entrada en la bitácora)
```

---

## 🧠 Prompt del Agente de IA

El agente recibe el contenido completo del archivo y genera un resumen con el siguiente prompt:

> 💡 ¿Tenés dudas sobre cómo redactar prompts efectivos para LLMs? Podés profundizar en mi guía: [📖 RedactarPrompt.LLM — README](https://github.com/sher414/Process/blob/main/RedactarPrompt.LLM/README.md)

```
Eres un Analista de Inteligencia de Negocios experto en síntesis de reportes corporativos.

TAREA:
Analiza el siguiente texto y genera un resumen estructurado en formato JSON estricto.
El resumen no debe superar las 200 palabras en total.

TEXTO A ANALIZAR:
{{ $json.data }}

FORMATO DE SALIDA OBLIGATORIO (responde SOLO con el JSON, sin texto adicional):
{
  "titulo_ejecutivo": "título breve del reporte",
  "hallazgo_principal": "el hallazgo más importante en 1 oración",
  "resumen_contenido": "resumen del contenido en máximo 150 palabras",
  "pasos_sugeridos": ["paso 1", "paso 2", "paso 3"]
}
```

---

## 📤 Ejemplo de input

Archivo `.txt` subido a la carpeta `Reportes_IA` en Google Drive:

```
Reporte de ventas - Mayo 2026
Las ventas del mes aumentaron un 15% respecto al mes anterior.
El producto más vendido fue el modelo X con 340 unidades.
Se detectaron problemas de stock en la región norte.
Se recomienda revisar la cadena de suministro para el próximo trimestre.
```

---

## 📥 Ejemplo de output en Bitácora

```
𝗡𝗨𝗘𝗩𝗢 𝗥𝗘𝗣𝗢𝗥𝗧𝗘
𝗧í𝘁𝘂𝗹𝗼: Informe de Ventas - Mayo 2026

𝗛𝗮𝗹𝗹𝗮𝘇𝗴𝗼 𝗣𝗿𝗶𝗻𝗰𝗶𝗽𝗮𝗹:
Las ventas de mayo 2026 experimentaron un incremento del 15% respecto al mes anterior,
aunque se identificaron desafíos logísticos.

𝗥𝗲𝘀𝘂𝗺𝗲𝗻:
El reporte de ventas de mayo 2026 destaca un crecimiento del 15% en comparación
con el mes previo. El producto estrella fue el modelo X, alcanzando 340 unidades
vendidas. Sin embargo, surgieron problemas de stock en la región norte...

𝗣𝗮𝘀𝗼𝘀 𝗦𝘂𝗴𝗲𝗿𝗶𝗱𝗼𝘀:
▸ Analizar la causa raíz de los problemas de stock en la región norte.
▸ Revisar y optimizar la cadena de suministro para el próximo trimestre.
▸ Continuar monitoreando el desempeño del modelo X.
―――――――――――――――――――――
```

---

## ⚙️ Configuración requerida

| Componente | Detalle |
|-----------|---------|
| **n8n** | Local (localhost:5678) |
| **Google Drive** | OAuth2 — carpeta: `Reportes_IA` |
| **Google Docs** | OAuth2 — doc: `Bitácora.Resumen.IA` |
| **LLM** | Google Gemini 2.5 Flash Lite |
| **Trigger** | Schedule — cada 1 hora |

---

## 🧩 Decisiones técnicas

### ¿Por qué Google Gemini 2.5 Flash Lite?

Los modelos LLM se eligen según la complejidad de la tarea y el contexto de ejecución. En este flujo la tarea es **resumir texto estructurado** — no requiere razonamiento profundo ni creatividad avanzada. Por eso se eligió **Gemini 2.5 Flash Lite** por estas razones:

| Criterio | Decisión |
|---------|----------|
| **Velocidad** | Flash Lite responde en milisegundos — ideal para flujos automatizados que corren cada hora |
| **Costo** | Es el modelo más económico de la familia Gemini — importante en automatizaciones que se ejecutan repetidamente |
| **Suficiencia** | Para síntesis de texto corto/medio, un modelo ligero produce resultados de igual calidad que uno más potente |
| **Estabilidad** | Es una versión estable de producción, minimizando errores 503 en ejecuciones frecuentes |

> Modelos como Gemini 2.5 Pro o GPT-4 tienen sentido cuando la tarea requiere razonamiento complejo, análisis multimodal o generación creativa avanzada. Para este caso hubiera sido sobredimensionado y más costoso sin ningún beneficio real.

> 📖 ¿Necesitás profundizar sobre cómo elegir modelos LLM y entender sus diferencias de costo y capacidad? Leé más en mi guía: [ConfigurarLLM — README](https://github.com/sher414/Process/tree/main/ConfigurarLLM)

---

### ¿Por qué no se configuraron Memory ni Tools en el AI Agent?

El nodo AI Agent en n8n ofrece tres conectores opcionales: **Chat Model** (obligatorio), **Memory** y **Tools**. En este flujo solo se usó el modelo, y esto fue una decisión deliberada:

**Memory — No necesaria porque:**
- Cada ejecución del flujo es **independiente**: analiza un archivo nuevo sin necesidad de recordar ejecuciones anteriores
- La "memoria" del sistema vive en el propio Google Doc (la bitácora), no en el Agente
- Agregar memoria sin necesidad consumiría tokens adicionales en cada ejecución, aumentando el costo y la latencia

**Tools — No necesarias porque:**
- El Agente tiene **una sola responsabilidad**: recibir texto y devolver un JSON estructurado
- No necesita buscar información externa, hacer cálculos, consultar APIs ni ejecutar acciones
- Agregar tools innecesarias complejiza el flujo y puede generar comportamientos inesperados del Agente

> En automatizaciones profesionales, la regla es: **agregar solo lo que el flujo necesita**. Menos componentes = menos puntos de falla = más confiabilidad en producción.

---

## 💡 Aprendizajes clave

- Los modelos LLM devuelven JSON envuelto en bloques Markdown (` ```json `) — siempre limpiar con regex antes de parsear
- n8n itera automáticamente sobre múltiples items — si hay 3 archivos en Drive, el flujo procesa los 3 en una sola ejecución
- El nodo `Extract from Text File` es necesario para convertir el output binario del Download a texto plano legible por el Agente
- Los caracteres Unicode permiten simular negrita/cursiva en Google Docs sin necesidad de la API de formato

---

## 🗂️ Estructura del repositorio

```
Process/
└── N8N-Automatizaciones/
    └── Automatizaciones/
        └── Desafio2/
            ├── README.md
            └── Desafio2-Monitor-Drive-Bitacora-IA.json
```

---

## 👤 Autor

**Sherman** — Ingeniero Industrial en transición hacia Automatización, IA Aplicada y Transformación Digital.

GitHub: [@sher414](https://github.com/sher414)
