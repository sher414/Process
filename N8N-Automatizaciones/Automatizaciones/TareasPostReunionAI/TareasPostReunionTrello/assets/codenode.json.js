// Tomamos el texto crudo que devolvió el LLM
let raw = $input.first().json.text;

// Defensivo: si el LLM envolvió el JSON en ```json ... ```, lo limpiamos
// Buscamos desde el primer [ hasta el último ]
const match = raw.match(/\[[\s\S]*\]/);
if (match) {
  raw = match[0];
}

// Convertimos el string en un array real de objetos
const tareas = JSON.parse(raw);

// Devolvemos cada tarea como un ítem separado de n8n
return tareas.map(t => ({ json: t }));