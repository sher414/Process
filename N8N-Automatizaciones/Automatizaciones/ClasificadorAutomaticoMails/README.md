---

## ✨ Mejoras Clave

- **Idempotencia**: cada email se procesa exactamente una vez usando hash MD5
- **Rate Limiting**: espera de 1 segundo entre ejecuciones para respetar la API de Gmail
- **Clasificación IA**: Gemini clasifica cada email en 6 campos estructurados
- **Structured Output**: parseo garantizado con extracción regex y limpieza
- **Log de auditoría**: cada email procesado queda registrado con su estado

---

## 🤖 Campos generados por la IA

| Campo | Descripción |
|---|---|
| `tipo` | Consulta / Solicitud / Urgente / Informativo / Spam |
| `prioridad` | Alta / Media / Baja |
| `resumen` | Resumen del email en máximo 30 palabras |
| `acciones` | Acciones recomendadas en máximo 20 palabras |
| `respuesta_sugerida` | Borrador de respuesta en máximo 50 palabras |
| `es_cliente` | true / false |

---

## 🗂️ Archivos

| Archivo | Descripción |
|---|---|
| `ClasificadorAutDeCorreosConIA_Avanzado.json` | Export del workflow n8n |
| `generar_hash.js` | Lógica de generación de hash (comentada) |
| `parsear_respuesta_ia.js` | Parser de respuesta IA (comentado) |
| `Flow - Completo.png` | Screenshot del flujo completo |
| `Gsheet_procesado.png` | Screenshot del output en Google Sheets |

---

## 🧠 Conceptos Aprendidos

- **Idempotencia**: una operación ejecutada N veces siempre produce el mismo resultado
- **Hash MD5**: convertir un ID único en una huella digital de longitud fija
- **Rate Limiting**: controlar la frecuencia de ejecución para respetar cuotas de API
- **Structured Outputs**: forzar formato JSON en respuestas de modelos de lenguaje
- **Fallback patterns**: manejo de outputs vacíos con `?? 'NO_EXISTE'`

---

## 🛠️ Stack

- **Automatización**: n8n (local)
- **Modelo IA**: Google Gemini 2.0 Flash
- **Email**: Gmail OAuth2
- **Almacenamiento**: Google Sheets
- **Lenguaje**: JavaScript (nodos Code)

---

## 👤 Autor

**Germán Pablo Morvillo**
Ingeniero Industrial | Automation Developer | AI Integration
[LinkedIn](https://www.linkedin.com/in/german-morvillo) · [GitHub](https://github.com/sher414)