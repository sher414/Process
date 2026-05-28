# 🤖 Configuración de LLMs y Automatización con n8n

---

## 📌 ¿Por qué importa elegir bien el LLM?

El modelo que uses determina la calidad, velocidad y costo de tu agente. No hay uno "mejor": cada uno tiene un caso de uso ideal.

---

## 🔍 Comparativa de los 3 grandes

| | **OpenAI (GPT)** | **Google Gemini** | **Anthropic Claude** |
|---|---|---|---|
| **Modelos clave** | GPT-4o, GPT-4o-mini | Gemini 2.5 Pro, Flash | Claude 3.5 Sonnet, Haiku |
| **Mejor para** | Contenido creativo, chatbots | Documentos largos, velocidad, multimodal | Código, análisis técnico, precisión |
| **Fortaleza destacada** | Ecosistema maduro, function calling | Contexto de 1M tokens, velocidad | Líder en coding (72.5% SWE-bench), menos alucinaciones |
| **Debilidad** | Más costoso | Menor adopción, docs menos maduras | Sin memoria nativa, disponibilidad limitada |
| **Precio aprox.** | $10 input / $30 output por 1M tokens | Más económico que GPT-4 (gratis con límites) | Similar a GPT-4, con caching hasta -90% |

### 🧭 ¿Cuándo usar cada uno?

- **OpenAI** → Chatbots, generación de contenido, tareas generales
- **Gemini** → Procesar PDFs largos, análisis masivo de datos, apps que necesitan velocidad
- **Claude** → Programación, compliance, casos donde la precisión es crítica

---

## ⚙️ Parámetros de configuración explicados

### 🌡️ Temperature (Temperatura)
Controla **qué tan creativo o predecible** es el modelo.

| Valor | Efecto | Usar para |
|---|---|---|
| `0.0 – 0.2` | Determinista, muy preciso | Clasificación, extracción de datos |
| `0.3 – 0.5` | Balance seguro | Soporte al cliente |
| `0.7 – 0.9` | Creativo, variado | Generación de contenido |
| `0.9 – 1.2` | Muy libre, experimental | Brainstorming |

**Ejemplo visual con el prompt "Describe el cielo":**
- `temp 0.0` → *"El cielo es azul debido a la dispersión de la luz solar."*
- `temp 0.7` → *"El cielo presenta un hermoso tono azul, creado por la dispersión Rayleigh..."*
- `temp 1.5` → *"El cielo danza en tonalidades cerúleas, un lienzo cósmico..."*

---

### 🔢 Max Tokens
Define el **límite máximo de longitud** de la respuesta. Afecta directamente los costos (pagás por output tokens).

```json
{ "max_tokens": 50 }    // Clasificación / respuestas cortas
{ "max_tokens": 500 }   // Chatbot normal
{ "max_tokens": 2000 }  // Artículos o contenido largo
{ "max_tokens": 4096 }  // Sin límite estricto (máximo del modelo)
```

> ⚠️ Si el modelo llega al límite, la respuesta se corta. Ajustalo según tu caso de uso.

---

### 🎯 Top P (Nucleus Sampling)
Controla la **diversidad de vocabulario**. Rango: `0.0` a `1.0`.

- `0.1` → Solo palabras muy probables (respuestas conservadoras)
- `0.5` → Balance
- `0.9 – 1.0` → Considera más opciones

> 💡 **Regla práctica**: Usá `temperature` O `top_p` para controlar creatividad, no los dos al máximo a la vez. Un buen default es `top_p = 0.9`.

---

### 🚫 Frequency & Presence Penalty *(solo OpenAI)*

| Parámetro | Qué hace | Cuándo usarlo |
|---|---|---|
| `frequency_penalty` | Penaliza repetir las mismas palabras | Contenido variado, evitar frases repetidas |
| `presence_penalty` | Penaliza mencionar temas ya hablados | Exploración de ideas, fomentar nuevos tópicos |

```json
{
  "frequency_penalty": 0.3,  // Reduce repetición de frases
  "presence_penalty": 0.6    // Fomenta nuevos tópicos
}
```

---

### 📋 Configs recomendadas en n8n

**OpenAI (GPT-4o)**
```json
{
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}
```

**Google Gemini 2.5 Pro**
```json
{
  "model": "gemini-2.5-pro",
  "temperature": 0.5,
  "maxOutputTokens": 8192,
  "topP": 0.95,
  "topK": 40
}
```

**Anthropic Claude 3.5 Sonnet**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.3,
  "max_tokens": 4096,
  "top_p": 1,
  "top_k": 5
}
```

---

## 🧩 Patrones de Orquestación de Agentes en n8n

### Patrón 1: Pipeline Secuencial
Un agente clasifica y delega a otros según el resultado.

```
Webhook → Agente Clasificador → ¿Es urgente?
                                    ├── SÍ → Agente de Respuesta Inmediata → Send Email
                                    └── NO → Schedule → Agente de Respuesta Diferida
```

**Caso de uso típico**: Atención al cliente, triaje de tickets.

---

### Patrón 2: Orquestación Jerárquica
Un agente supervisor delega tareas especializadas.

```
Agente Supervisor
   ├── Agente A: Research  (busca datos)
   ├── Agente B: Writing   (genera narrativa)
   └── Agente C: Review    (valida y corrige)
```

**Ejemplo real**: Generación automática de informes de ventas.
1. Supervisor recibe: *"Genera informe Q4"*
2. Research busca datos y calcula métricas
3. Writing redacta el informe
4. Review valida coherencia y números
5. Output: Informe completo listo

---

### Patrón 3: Procesamiento Paralelo
Varios agentes trabajan al mismo tiempo y un nodo agrega los resultados.

```
Input → [Agente A | Agente B | Agente C] → Aggregator → Agente Final
```

**Ejemplo real**: Análisis de percepción de marca
- Agente A analiza Twitter
- Agente B analiza reseñas de Google
- Agente C analiza comentarios de blog
- Aggregator combina → Agente Final genera resumen consolidado

---

## 🧠 Arquitectura de Memoria en Agentes

Los agentes no recuerdan nada por sí solos. La memoria hay que construirla.

### 1. Memoria de Conversación (Short-term)
Pasás el historial completo en cada llamada al LLM.

```json
[
  { "role": "user", "content": "¿Cuál es mi saldo?" },
  { "role": "assistant", "content": "Tu saldo es $1,250.00" },
  { "role": "user", "content": "¿Y cuánto gasté este mes?" }
]
```

**Implementación n8n**: `Webhook → Get History (DB) → AI Agent + History → Save to DB`

---

### 2. Memoria de Usuario (Long-term)
Guardás datos del usuario en una base de datos y los inyectás en el system prompt.

```json
{
  "user_id": "12345",
  "nombre": "Juan Pérez",
  "preferencias": { "idioma": "es", "timezone": "America/Mexico_City" },
  "contexto": { "empresa": "Tech Corp", "rol": "CEO" },
  "historial_interacciones": [...]
}
```

Luego en el system prompt:
```
Eres un asistente para {user.nombre} ({user.rol} en {user.empresa}).
Idioma: {user.preferencias.idioma}
Usa este contexto para personalizar tus respuestas.
```

---

### 3. Memoria Semántica (Vector Store)
Para buscar en grandes volúmenes de información pasada.

```
Pregunta del usuario
    → Generar embedding (OpenAI/Gemini)
    → Búsqueda por similitud (Pinecone/Supabase)
    → Recuperar top 5 resultados relevantes
    → Incluir en contexto del agente
    → Respuesta informada
```

**Cuándo usarlo**: cuando tenés mucho historial y necesitás que el agente "recuerde" conversaciones antiguas sin pasarlas todas.

---

## 🚀 Resumen para arrancar

| Si querés... | Usá... |
|---|---|
| Empezar rápido y barato | Gemini Flash con temperature 0.3-0.5 |
| Máxima precisión en código | Claude 3.5 Sonnet con temperature 0.3 |
| Chatbot conversacional general | GPT-4o con temperature 0.7 |
| Agente simple en n8n | Patrón Pipeline Secuencial |
| Sistema complejo con especialistas | Patrón Jerárquico |
| Que el agente "recuerde" usuarios | Memoria Long-term en base de datos |

