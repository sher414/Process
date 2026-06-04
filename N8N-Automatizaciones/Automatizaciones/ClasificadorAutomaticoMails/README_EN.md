---

## ✨ Key Features

- **Idempotency**: each email is processed exactly once using MD5 hash tracking
- **Rate Limiting**: 1 second wait between executions to respect Gmail API quotas
- **AI Classification**: Google Gemini classifies each email into 6 structured fields
- **Structured Output**: guaranteed JSON parsing with regex extraction and cleanup
- **Audit Log**: every processed email is logged with status in Google Sheets

---

## 🤖 AI Output Fields

| Field | Description |
|---|---|
| `tipo` | Consulta / Solicitud / Urgente / Informativo / Spam |
| `prioridad` | Alta / Media / Baja |
| `resumen` | 30-word summary of the email |
| `acciones` | Recommended actions in 20 words |
| `respuesta_sugerida` | Draft reply in 50 words |
| `es_cliente` | true / false |

---

## 🗂️ Files

| File | Description |
|---|---|
| `ClasificadorAutDeCorreosConIA_Avanzado.json` | n8n workflow export |
| `generar_hash.js` | Hash generation logic (commented) |
| `parsear_respuesta_ia.js` | AI response parser (commented) |
| `Flow - Completo.png` | Complete workflow screenshot |
| `Gsheet_procesado.png` | Google Sheets output screenshot |

---

## 🧠 Concepts Learned

- **Idempotency**: an operation executed N times always produces the same result
- **MD5 Hashing**: converting a unique ID into a fixed-length fingerprint
- **Rate Limiting**: controlling execution frequency to respect API quotas
- **Structured Outputs**: enforcing JSON format from LLM responses
- **Fallback patterns**: handling empty outputs with `?? 'NO_EXISTE'`

---

## 🛠️ Stack

- **Automation**: n8n (local)
- **AI Model**: Google Gemini 2.0 Flash
- **Email**: Gmail OAuth2
- **Storage**: Google Sheets
- **Language**: JavaScript (Code nodes)

---

## 👤 Author

**Germán Pablo Morvillo**
Industrial Engineer | Automation Developer | AI Integration
[LinkedIn](https://www.linkedin.com/in/german-morvillo) · [GitHub](https://github.com/sher414)