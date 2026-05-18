# 🧩 Contenido del Repositorio

## 📂 BPMN
Incluye diagramas, conceptos fundamentales y ejemplos prácticos de modelado de procesos:

- Diagramas BPMN básicos e intermedios
- Eventos, compuertas, flujos y actividades
- Ejemplos de procesos reales modelados
- Buenas prácticas de documentación

## 📂 Power Automate
Automatizaciones low-code:

- Flujos automatizados
- Ejemplos de integración
- Casos de uso simples y avanzados

---

## 🛠️ Tecnologías Utilizadas

- BPMN 2.0
- UiPath Studio / UiPath Platform
- Power Automate Desktop & Cloud
- Process Documentation & Analysis

---

## 🧠 Habilidades Demostradas

- Modelado de procesos con BPMN
- Diseño de automatizaciones end-to-end
- Documentación técnica clara y profesional
- Análisis funcional y optimización de procesos
- Integración de herramientas RPA y low-code
- Buenas prácticas de versionado y repositorios Git

---

## 📌 Caso Práctico (Recomendado para ampliar)

**Automatización completa: desde BPMN hasta UiPath**

Podés agregar un caso práctico que incluya:

- Diagrama BPMN
- Explicación del proceso
- Automatización en UiPath
- Capturas del flujo
- Resultado final

> Esto eleva muchísimo el valor del portfolio.

---

## 👤 Autor

**Germán**  
Industrial Engineer · Digital Transformation · Process Automation  
Especialista en BPMN, UiPath, Power Automate y optimización de procesos.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Germán%20Morvillo-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/german-pablo-morvillo)
[![Email](https://img.shields.io/badge/Email-germanmorvillo%40hotmail.com-D14836?style=flat&logo=microsoftoutlook)](mailto:germanmorvillo@hotmail.com)

---

# Agentic Process — End‑to‑End Guide
### BPMN → Orchestrator → Jobs → Monitoring
*UiPath Maestro · BPMN · Orchestrator · Monitoring*

---

## 📑 Índice

1. [Modelado del Agentic Process en BPMN](#1️⃣-modelado-del-agentic-process-en-bpmn)
2. [Publicación del proceso en Orchestrator](#2️⃣-publicación-del-proceso-en-orchestrator)
3. [Iniciar un Job con Inputs](#3️⃣-iniciar-un-job-con-inputs)
4. [Verificar ejecuciones en Job History (Monitoring)](#4️⃣-verificar-ejecuciones-en-job-history-monitoring)
5. [Analítica de Process Instances](#5️⃣-analítica-de-process-instances)

---

## 1️⃣ Modelado del Agentic Process en BPMN

Este es el diseño del proceso en UiPath Maestro, con un Start Event, un Timer, un Exclusive Gateway y tres ramas posibles según el input recibido.

### 📸 Diagrama BPMN

![BPMN Model](./images/bpmn_model.png)

En este ejemplo, la variable global `Path` determina qué rama toma el proceso:

- `"A"` → Task A
- `"B"` → Task B
- `"123"` → Task 123

Durante la ejecución, el valor de la variable se ve reflejado en el panel de Global Variables.

### 📸 Ejecución del BPMN con variable Path

![Execution Trail BPMN](./images/execution_trail.png)

---

## 2️⃣ Publicación del proceso en Orchestrator

Una vez validado el BPMN, se publica desde Maestro y aparece en Orchestrator como un Agentic Process.

### 📸 Ventana de Start Job con Entry Point e Input

![Start Job Input](./images/start_job_input.png)

Aquí se define:

- Entry Point (Start Event del BPMN)
- Inputs (ej: `Path = "123"`)
- Execution Identity si corresponde

---

## 3️⃣ Iniciar un Job con Inputs

Desde **Automations → Jobs**, se puede iniciar una ejecución manual del proceso.

### 📸 Lista de Jobs ejecutados

![Jobs List](./images/jobs_list.png)

Cada ejecución muestra:

- Estado (Running, Success, Faulted)
- Duración
- Usuario
- Prioridad
- Tipo de runtime

---

## 4️⃣ Verificar ejecuciones en Job History (Monitoring)

El panel de Monitoring permite ver el estado general de los procesos ejecutados.

### 📸 Dashboard de Monitoring

![Monitoring Dashboard](./images/monitoring_dashboard.png)

Incluye:

- Jobs Running
- Jobs Successful
- Faulted
- Stopped
- Gráficos de distribución

---

## 5️⃣ Analítica de Process Instances

UiPath Maestro también ofrece un panel de analítica para ver:

- Procesos más ejecutados
- Duración total
- Cantidad de completados vs fallados
- Versiones del proceso

### 📸 Panel de Process Instances

![Process Instances](./images/process_instances.png)

Este panel es clave para:

- Auditoría
- Optimización
- Identificación de fallas
- Métricas de rendimiento
