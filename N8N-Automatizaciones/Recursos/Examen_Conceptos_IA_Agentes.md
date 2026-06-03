# 📝 Examen — Conceptos de IA y Agentes en n8n

Resumen de preguntas y respuestas del examen sobre fundamentos de IA aplicada, agentes y estructura de datos en n8n.

---

## Pregunta 1 — Metodología RCICE · System Prompt

**¿Cuáles elementos forman parte del componente Contexto en un System Prompt?**

✅ La estructura de formato de salida JSON (Restricciones)  
✅ El nivel de experiencia (Rol)

**Explicación:**
En la metodología **RCICE** (Rol, Contexto, Instrucciones, Constraints, Ejemplos), el **Contexto** le da al agente información de fondo: quién es (el Rol / nivel de experiencia) y bajo qué reglas opera (por ejemplo, el formato de salida esperado, que va en las Restricciones). La audiencia objetivo, los Few-Shot Examples y el entorno de la empresa son otros componentes de RCICE, pero no pertenecen específicamente a la sección "Contexto".

---

## Pregunta 2 — Estructura de datos en n8n

**¿Cuáles campos contienen los datos estructurados y los datos de archivos respectivamente en cada ítem JSON que fluye entre nodos?**

✅ json  
✅ binary

**Explicación:**
Cada ítem que viaja entre nodos en n8n tiene dos campos internos:
- `json` → guarda los datos estructurados (texto, números, objetos). Se accede con `$json.campo`
- `binary` → guarda archivos o datos en binario (imágenes, PDFs). Se accede con `$binary.nombreArchivo`

Los otros términos (PairedItem, Temperature, Context Window) no son campos de la estructura de ítem en n8n.

---

## Pregunta 3 — Agentes Reactivos

**¿Cuáles opciones describen correctamente una característica de los Agentes Reactivos?**

✅ Planifican de forma exhaustiva antes de ejecutar cualquier acción  
✅ Responden directamente a estímulos

**Explicación:**
Los **Agentes Reactivos** actúan en respuesta directa a lo que perciben del entorno (estímulo → acción), sin mantener un modelo interno complejo del mundo. Su fortaleza es la velocidad de respuesta ante eventos en tiempo real. No son ideales para planificación de calendarios complejos (eso es tarea de agentes deliberativos).

**Ejemplo concreto en n8n:**
Un workflow que monitorea Gmail. Cada vez que llega un email con la palabra "urgente" en el asunto, el agente reacciona al instante: clasifica el email, crea un ticket en Airtable y envía una alerta — todo sin planificación previa, solo respuesta al estímulo.

```
Email entra → Detecta "urgente" → Crea ticket en Airtable → Envía alerta
```

---

## Pregunta 4 — Memoria a Largo Plazo

**¿Cuál es una implementación tecnológica típica de la Memoria a Largo Plazo de un agente?**

✅ Bases de datos

**Explicación:**
La **Memoria a Largo Plazo** necesita persistir información entre sesiones (que los datos no se pierdan al terminar la conversación). Las **bases de datos** (SQL, NoSQL) son la implementación clásica para esto. Los Vectorstores también son válidos para memoria semántica a largo plazo.

| Tipo de memoria | Dónde vive | Persiste entre sesiones |
|---|---|---|
| Context Window | RAM del LLM | ❌ No |
| System Prompt | Instrucción inicial | ❌ No |
| Bases de datos | Almacenamiento externo | ✅ Sí |
| Vectorstores | Base vectorial | ✅ Sí |

---

## Pregunta 5 — Módulo de Acción del Agente

**¿Cuál es un ejemplo de herramienta (Tool) que podría usar el Módulo de Acción?**

✅ Llamar a APIs externas

**Explicación:**
El **Módulo de Acción** es la parte del agente que ejecuta acciones en el mundo real. Una **Tool** es cualquier función que el agente puede invocar para hacer algo externo: buscar en internet, enviar un email, leer una base de datos, o llamar a APIs externas.

- LLM Core → el "cerebro" que razona
- System Prompt → la instrucción inicial
- Context Window → la memoria temporal de la sesión
- **Llamar a APIs externas → herramienta de acción** ✅

---

*Generado como material de estudio — Curso de Automatizaciones con n8n e IA*
