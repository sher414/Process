// ============================================================
// PARSER + FAN-OUT
// Convierte la respuesta de la IA (un string JSON) en ítems
// individuales de n8n, uno por cada tarea extraída.
// ============================================================

// 1) Tomamos el texto crudo que devolvió el LLM.
//    Viene como string dentro del campo "text".
let raw = $input.first().json.text;

// 2) LIMPIEZA DEFENSIVA:
//    A veces el LLM envuelve el JSON en un bloque markdown (```json ... ```).
//    Este regex extrae solo el array, desde el primer "[" hasta el último "]",
//    descartando cualquier texto o backticks que sobren.
const match = raw.match(/\[[\s\S]*\]/);
if (match) {
  raw = match[0];
}

// 3) PARSEO:
//    Convertimos el string en un array real de objetos JavaScript.
//    A partir de acá, n8n puede trabajar con los datos campo por campo.
const tareas = JSON.parse(raw);

// 4) FAN-OUT (uno-a-muchos):
//    .map() recorre cada tarea y la envuelve en { json: ... },
//    el formato que n8n reconoce como "un ítem".
//    Al devolver un array de N de estos, n8n trata cada tarea como
//    un ítem independiente. Resultado: el nodo siguiente (Asana) se
//    ejecuta una vez por tarea y crea N tarjetas automáticamente,
//    SIN necesidad de un bucle manual.
return tareas.map(t => ({ json: t }));