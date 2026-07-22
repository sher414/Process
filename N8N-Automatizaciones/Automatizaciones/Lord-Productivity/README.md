# Lord-Productivity

![n8n](https://img.shields.io/badge/n8n-automation-EA4B71?logo=n8n&logoColor=white)
![status](https://img.shields.io/badge/status-case%20study-blue)

Automatización con n8n que convierte reportes diarios de tareas en un tablero Kanban en Trello, calculando automáticamente un indicador de productividad por persona.

> **Case study de portfolio.** Este repo documenta el problema, el enfoque y el resultado del proyecto. La implementación completa (workflow, fórmula de scoring y configuración) es parte de una solución que ofrezco como servicio — si te interesa algo similar para tu equipo, [escribime](mailto:germanmorvillo@gmail.com).

## Tabla de contenidos

- [El problema](#el-problema)
- [El enfoque](#el-enfoque)
- [Resultado](#resultado)
- [Arquitectura general](#arquitectura-general)
- [Stack técnico](#stack-técnico)
- [Contacto](#contacto)

## El problema

Un supervisor con varias personas a cargo necesita saber, todos los días, quién trabajó cuánto y en qué — sin tener que abrir planillas, sumar minutos a mano, o esperar a que alguien le avise que algo anda mal. En equipos de 5-10 personas, esa revisión manual se lleva entre 15 y 20 minutos diarios y depende de que el supervisor se acuerde de hacerla.

## El enfoque

Cada persona registra sus tareas del día en un archivo de texto simple (`actividad, minutos`) — sin apps nuevas que aprender, sin planillas complejas. Una automatización en n8n:

1. Lee automáticamente los reportes de todas las personas
2. Calcula un **score de productividad de 0 a 100** combinando minutos trabajados y cantidad de tareas realizadas, con una curva que premia el punto óptimo (ni sub-carga ni fragmentación excesiva en micro-tareas)
3. Genera un tablero Kanban en Trello: una columna por persona, con su tarjeta-resumen (score + badge de rendimiento) y el detalle de cada tarea del día

Todo esto corre solo, todos los días hábiles, sin intervención manual.

## Resultado

Demo pública con datos de ejemplo (6 "jugadores" ficticios, jornada de 8hs): 🔗 [Ver tablero en Trello](https://trello.com/b/yxlPs8mP/lord-productivity)

| Persona (ejemplo) | Score | Indicador |
|---|---|---|
| El DIBU | 100 | 🟢 Alto rendimiento |
| MESSI | 100 | 🟢 Alto rendimiento |
| LAUTARO MARTINEZ | 93 | 🟢 Alto rendimiento |
| ROMERO | 76 | 🟡 Rendimiento medio |
| LA ARAÑA | 63 | 🟡 Rendimiento medio |
| PAREDES | 37 | 🔴 Bajo rendimiento |

## Arquitectura general

```mermaid
flowchart LR
    A[Trigger diario] --> B[Lectura de reportes .txt]
    B --> C[Cálculo de score de productividad]
    C --> D[Generación de tablero Kanban en Trello]
```

A alto nivel, el pipeline combina:
- **Ingesta de archivos** desde una carpeta compartida
- **Procesamiento y cálculo** de un indicador propio de productividad
- **Publicación automática** en una herramienta visual que el equipo ya usa (Trello)

## Stack técnico

- **n8n** (self-hosted, Docker) — orquestación del flujo
- **JavaScript** (Code nodes) — parseo de datos y lógica de scoring
- **Trello API** — generación del tablero Kanban
- Arquitectura pensada para escalar a persistencia histórica (Google Sheets / Supabase) y dashboards en Power BI

## Contacto

**Germán Pablo Morvillo** — Ingeniero Industrial en transición a Automatización & IA Aplicada
📧 germanmorvillo@gmail.com
🔗 [LinkedIn](https://linkedin.com/in/german-pablo-morvillo)
🔗 [Más proyectos](https://github.com/sher414/Process)
