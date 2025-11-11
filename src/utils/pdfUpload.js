// Utilidad para subir PDFs a facturas

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Sube un archivo PDF a una factura específica
 * @param {number} facturaId - ID de la factura
 * @param {File} archivo - Archivo PDF a subir
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function subirPDFFactura(facturaId, archivo) {
  try {
    // Validar que sea un PDF
    if (archivo.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF');
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (archivo.size > maxSize) {
      throw new Error('El archivo no debe superar los 5MB');
    }

    const formData = new FormData();
    formData.append('pdf', archivo);

    const response = await fetch(`${API_URL}/facturas/${facturaId}/pdf`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al subir el PDF');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al subir PDF:', error);
    throw error;
  }
}

/**
 * Descarga el PDF de una factura
 * @param {number} facturaId - ID de la factura
 * @returns {Promise<void>}
 */
export async function descargarPDFFactura(facturaId) {
  try {
    const response = await fetch(`${API_URL}/facturas/${facturaId}/pdf`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al descargar el PDF');
    }

    // Obtener el blob del PDF
    const blob = await response.blob();
    
    // Crear URL temporal
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace temporal y hacer clic
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura_${facturaId}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    throw error;
  }
}
