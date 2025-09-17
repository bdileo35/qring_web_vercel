// Función para formatear número de WhatsApp correctamente para Argentina
export const formatearNumeroWhatsApp = (numero: string): string => {
  // Remover espacios y caracteres especiales
  let numeroLimpio = numero.replace(/\s+/g, '').replace(/[^\d]/g, '');
  
  // Si empieza con 11 (código de área de Buenos Aires), agregar +54
  if (numeroLimpio.startsWith('11')) {
    return `+54${numeroLimpio}`;
  }
  
  // Si ya tiene +54, devolver tal como está
  if (numeroLimpio.startsWith('54')) {
    return `+${numeroLimpio}`;
  }
  
  // Si empieza con 15 (móvil argentino), agregar +54 9
  if (numeroLimpio.startsWith('15')) {
    return `+549${numeroLimpio.substring(2)}`;
  }
  
  // Para otros casos, asumir que es un número argentino y agregar +54
  return `+54${numeroLimpio}`;
};

// Función para validar si un número es válido para WhatsApp
export const validarNumeroWhatsApp = (numero: string): boolean => {
  const numeroFormateado = formatearNumeroWhatsApp(numero);
  // Verificar que tenga el formato correcto: +54XXXXXXXXXX
  return /^\+54\d{8,}$/.test(numeroFormateado);
};
