// =============================================
// NODO: ParsearRespuestaIA
// WORKFLOW: Etapa3_ClasificadorAvanzado
// PROPÓSITO: Extraer y estructurar el JSON
//            devuelto por Gemini para guardarlo
//            en Google Sheets
// =============================================

// Obtenemos los datos de los nodos anteriores
const nodoAI = $('AI Agent').item.json;
const emailData = $('Gmail.Correo.No.Leido').item.json;
const hashData = $('Generar Hash').item.json;

// Limpieza del output de Gemini
// A veces devuelve markdown o comillas extras
let outputString = nodoAI.output || '';
outputString = outputString
  .replace(/```json|```/g, '')   // elimina bloques markdown
  .replace(/^["']+|["']+$/g, '') // elimina comillas al inicio/fin
  .trim();                        // elimina espacios en blanco

// Buscamos el bloque JSON { ... } dentro del string
// Usamos regex para extraer solo el objeto JSON
const match = outputString.match(/\{[\s\S]*\}/);

// Si encontramos JSON lo parseamos, sino usamos objeto vacío
const parsed = match ? JSON.parse(match[0]) : {};

// Retornamos el objeto estructurado con todos los campos
// que vamos a guardar en la Sheet Etapa3_Emails
return [{
  json: {
    email_hash: hashData.email_hash,          // huella única del email
    timestamp: new Date().toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires'
    }),                                        // fecha/hora en Argentina
    from: emailData.from?.value?.[0]?.address || '',  // remitente
    subject: emailData.subject || '',          // asunto original
    body_preview: (emailData.text || '').substring(0, 100), // primeros 100 chars
    tipo: parsed.tipo || '',                   // clasificación del email
    resumen: parsed.resumen || '',             // resumen generado por IA
    acciones: parsed.acciones || '',           // acciones recomendadas
    respuesta_sugerida: parsed.respuesta_sugerida || '', // borrador de respuesta
    notificado: false,                         // flag para el paso de notificación
    log: 'procesado_ok'                        // registro de estado
  }
}];