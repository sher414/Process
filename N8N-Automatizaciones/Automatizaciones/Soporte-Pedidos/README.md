# 🤖 Automatización de Soporte con N8N + IA

> Sistema de tickets automático que detecta emails de clientes, los clasifica con inteligencia artificial y responde en segundos — sin intervención humana.

---

## 🎯 Problema que resuelve

En muchas empresas, el soporte por email se gestiona **a mano**:

1. Alguien lee el email
2. Lo carga en una planilla
3. Decide a qué equipo derivarlo
4. Responde al cliente

Con este flujo, **todo ocurre automáticamente en segundos**.

---

## ⚙️ Flujo de automatización

```
Gmail Trigger
     ↓
Code JS — extrae y normaliza los datos del email
     ↓
Airtable — registra el ticket con estado "Sin clasificar"
     ↓
Google Gemini (IA) — clasifica el problema
     ↓
Airtable Update — actualiza la categoría del ticket
     ↓
Gmail — responde al cliente con número de ticket
```

---

## 🧠 Clasificación automática con IA

Google Gemini analiza el cuerpo del email y lo clasifica en:

| Categoría | Ejemplo |
|---|---|
| 📦 **Logística** | "No llegó mi paquete" |
| 💳 **Facturación** | "Me cobraron de más" |
| 🛒 **Producto** | "El producto llegó roto" |

---

## 🗂️ Ticket generado automáticamente

```json
{
  "ticketId": "TICKET-1779150802321",
  "numeroPedido": "45745",
  "remitente": "cliente@gmail.com",
  "asunto": "problema con mi pedido #45745",
  "cuerpo": "Hola, tuve un problema con mi entrega...",
  "categoria": "Logística",
  "fecha": "2026-05-18T20:20:28.000Z"
}
```

---

## 📧 Email de respuesta automática al cliente

```
✅ Recibimos tu consulta

Tu caso fue registrado con el número: TICKET-1779150802321
Pedido: #45745
Categoría: Logística
Tiempo estimado: 24 a 48 horas hábiles

Nuestro equipo se pondrá en contacto a la brevedad.
```

---

## 🛠️ Stack tecnológico

| Herramienta | Uso |
|---|---|
| **N8N** | Motor de automatización |
| **Gmail API** | Trigger de entrada + respuesta al cliente |
| **JavaScript** | Transformación y normalización de datos |
| **Airtable** | Base de datos de tickets |
| **Google Gemini** | Clasificación con IA |
| **Hoppscotch** | Testing de endpoints |

---

## 🐛 Problemas resueltos durante el desarrollo

| # | Problema | Solución aplicada |
|---|---|---|
| 1 | Orden incorrecto de nodos | Gmail Respuesta movido al final del flujo |
| 2 | Cuerpo del email contaminado | Filtro `-from:me` en Gmail Trigger |
| 3 | Asunto acumulaba `Re: Re: Re:` | `.replace(/^(Re:\s*)+/gi, '')` en Code JS |
| 4 | `[No path back to node]` | Corrección de cadena de conexiones |
| 5 | Error 422 en Airtable | Operación cambiada a `Upsert` |

---

## 📁 Estructura del proyecto

```
soporte-pedidos/
├── README.md
├── Soporte-Pedidos.json       ← workflow exportado de N8N
└── Alerta-Saldo.json          ← workflow adicional desarrollado
```

---

## 👨‍💻 Sobre este proyecto

Este proyecto fue desarrollado como ejercicio práctico de automatización con N8N, integrando servicios reales de Google, Airtable e IA generativa. Refleja la capacidad de diseñar, depurar y documentar flujos de trabajo automatizados aplicables a procesos empresariales reales.

**Apto para roles de:** Automatización, No-Code/Low-Code Developer, RevOps, Business Analyst, AI Integration Specialist.

---

*Desarrollado con N8N v2.20.7 — Buenos Aires, Argentina 🇦🇷*
