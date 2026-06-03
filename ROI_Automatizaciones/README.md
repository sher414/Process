# 📊 ROI en Automatización y Transformación Digital

> Material de referencia para evaluar, documentar y presentar el retorno de inversión de proyectos de automatización.

---

## ¿Qué es el ROI en automatización?

El **ROI (Return on Investment)** mide cuánto retorno genera una inversión en automatización respecto a su costo. A diferencia de otras inversiones, en automatización los beneficios suelen presentarse en múltiples formas: tiempo liberado, reducción de errores, escalabilidad y velocidad de ciclo.

---

## Fórmula base

```
ROI = ( Beneficios Totales − Costo de Inversión ) / Costo de Inversión × 100
```

**Ejemplo rápido:**
- Inversión total: $5,000
- Ahorro anual generado: $20,000
- ROI = (20,000 − 5,000) / 5,000 × 100 = **300%**

Un ROI del 300% significa que por cada $1 invertido, obtuviste $4 de vuelta (recuperaste el capital + $3 de ganancia).

---

## Componentes del cálculo

### Costos a incluir
| Ítem | Descripción |
|------|-------------|
| Desarrollo / configuración | Tiempo del equipo técnico o consultoría externa |
| Licencias de herramientas | n8n Cloud, Zapier, UiPath, Make, etc. |
| Capacitación | Horas de entrenamiento del equipo |
| Mantenimiento anual | Aprox. 15-20% de la inversión inicial |
| Infraestructura | Servidores, APIs, bases de datos si aplica |

### Beneficios a cuantificar
| Tipo | Cómo medirlo |
|------|-------------|
| Tiempo liberado | Horas/mes × costo hora del equipo × 12 meses |
| Reducción de errores | Frecuencia de errores × costo promedio por error |
| Velocidad de ciclo | Diferencia en tiempo de proceso × valor de esa velocidad |
| Escalabilidad | Costo que hubiera implicado crecer sin automatización |
| Disponibilidad 24/7 | Tareas que antes no podían hacerse fuera de horario laboral |

---

## Casos reales

### Caso 1 — Finanzas: Facturación automatizada
**Empresa:** PyME exportadora (manufactura)
**Problema:** 2 operarios procesando 400 facturas/mes manualmente (5 hs/día, error rate 3.2%)
**Solución:** Flujo en n8n con OCR + IA que extrae datos, valida contra ERP y genera asientos contables
**Resultados:**
- 95% de facturas procesadas sin intervención humana
- Error rate reducido de 3.2% a 0.1%
- Operarios redirigidos a análisis financiero de mayor valor

| Métrica | Valor |
|---------|-------|
| Inversión inicial | $4,200 |
| Ahorro anual | $17,600 |
| Período de payback | 3 meses |
| **ROI año 1** | **320%** |

---

### Caso 2 — RRHH: Onboarding automatizado
**Empresa:** Empresa de servicios, 200 empleados
**Problema:** Alta de empleado tomaba 3 días, involucraba 7 personas de distintos departamentos
**Solución:** Agente que coordina RRHH, IT y Finanzas: crea cuentas, envía contratos, configura accesos y agenda inducción
**Resultados:**
- Tiempo de onboarding reducido de 3 días a 4 horas
- Ahorro estimado: $820 por empleado nuevo

| Métrica | Valor |
|---------|-------|
| Inversión inicial | $3,500 |
| Ahorro anual | $9,800 |
| Período de payback | 4 meses |
| **ROI año 1** | **180%** |

---

### Caso 3 — Logística: IA conversacional para seguimiento de pedidos
**Empresa:** E-commerce regional
**Problema:** 1,200 consultas mensuales sobre estado de pedidos (60% del volumen de soporte)
**Solución:** Chatbot con IA conectado al WMS, responde en WhatsApp y web las 24hs
**Resultados:**
- 85% de consultas resueltas sin agente humano
- Tiempo de respuesta: de 4 horas a 30 segundos
- NPS mejoró 22 puntos en 6 meses

| Métrica | Valor |
|---------|-------|
| Inversión inicial | $6,000 |
| Ahorro anual | $30,600 |
| Período de payback | 2.5 meses |
| **ROI año 1** | **410%** |

---

### Caso 4 — Manufactura: Control de calidad con visión artificial
**Empresa:** Planta de packaging
**Problema:** 2.1% de productos defectuosos detectados al final de la línea (alto costo de retrabajo)
**Solución:** Sistema de visión artificial entrenado con 15,000 imágenes, inspección en tiempo real
**Resultados:**
- 97% de detección temprana de defectos
- Reducción de scrap: $4,200/mes
- Eliminación de paros de línea para inspección manual

| Métrica | Valor |
|---------|-------|
| Inversión inicial | $18,000 |
| Ahorro anual | $63,000 |
| Período de payback | 3.5 meses |
| **ROI año 1** | **250%** |

---

## Plantilla para documentar un caso de ROI

Copiar y completar para cada proceso que se evalúe:

```markdown
## Análisis de ROI — [Nombre del proceso]

### 1. Problema actual
- Proceso: [describir brevemente]
- Tiempo insumido: [horas/mes × cantidad de personas]
- Errores frecuentes: [tipo y costo estimado]
- Costo mensual actual: $[X]

### 2. Solución propuesta
- Herramienta/tecnología: [n8n / RPA / IA / otra]
- Descripción: [cómo automatiza o mejora el proceso]

### 3. Costos de implementación
- Desarrollo/configuración: $[X]
- Licencias mensuales: $[X]
- Capacitación: $[X]
- Total inversión inicial: $[X]
- Mantenimiento anual estimado: $[X]

### 4. Beneficios cuantificables
- Horas liberadas: [X horas/mes × $Y/hora = $Z/año]
- Reducción de errores: [frecuencia × costo promedio = $X/año]
- Velocidad de ciclo: [de X días a Y horas]
- Otros ahorros directos: $[X/año]
- **Total beneficio anual: $[X]**

### 5. Beneficios no cuantificables
- [Escalabilidad sin aumentar headcount]
- [Trazabilidad y auditabilidad del proceso]
- [Satisfacción del equipo al eliminar tareas repetitivas]
- [Menor dependencia de personas clave]

### 6. ROI proyectado
| Período | Cálculo | Resultado |
|---------|---------|-----------|
| Año 1 | (Beneficio − Inversión) / Inversión × 100 | X% |
| Año 3 | Acumulado 3 años / Inversión × 100 | X% |
| Payback | Inversión / Beneficio anual × 12 | X meses |

### 7. Riesgos y mitigación
| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Resistencia del equipo | Media | Capacitación e involucramiento temprano |
| Cambios en el proceso base | Baja | Diseño modular y documentación |
| Dependencia del proveedor | Media | Uso de herramientas open source cuando sea posible |
```

---

## Regla práctica para procesos candidatos a automatizar

Un proceso es buen candidato si cumple al menos 3 de estas condiciones:

- [ ] Se repite más de 10 veces por semana
- [ ] Toma más de 20 minutos cada vez que se ejecuta
- [ ] Sigue pasos predecibles (tiene reglas claras)
- [ ] Involucra mover datos entre sistemas (copy-paste entre apps)
- [ ] Es propenso a errores humanos
- [ ] No requiere criterio creativo ni relacional

---

## Recursos relacionados

- [Configuración de LLMs](../ConfigurarLLM/README.md)
- [Cómo funciona un Agente IA](../ComoFuncionaAgenteIA/README.md)
- [Automatizaciones en n8n]([../N8N-Automatizaciones/N8N_PADRE_README.md)

---

*Última actualización: junio 2025 · Sherman*
