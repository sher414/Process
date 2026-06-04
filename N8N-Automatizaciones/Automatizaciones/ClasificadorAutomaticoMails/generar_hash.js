// Obtenemos el ID único del email desde Gmail
// Si 'id' no existe, usamos 'threadId' como fallback
const emailId = $json.id || $json.threadId || '';

// Función hash simple sin módulos externos
// Convierte el emailId en un número único reproducible
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convierte a 32 bits
  }
  // Convertimos a hexadecimal y aseguramos que sea positivo
  return Math.abs(hash).toString(16);
}

const hash = simpleHash(emailId);

// Retornamos todos los campos originales del email
// más el campo nuevo email_hash
return [{
  json: {
    ...$json,
    email_hash: hash
  }
}];