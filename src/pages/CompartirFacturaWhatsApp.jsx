
import { Share2 } from 'lucide-react';

export default function CompartirFacturaWhatsApp({ factura }) {
  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const generarMensaje = () => {
    const propietario = factura.matricula?.predio?.propietario;
    const nombrePropietario = propietario 
      ? `${propietario.nombre} ${propietario.apellido}` 
      : 'Estimado(a) propietario(a)';

    const mensaje = `Hola ${nombrePropietario},

Le enviamos su factura de acueducto correspondiente al periodo ${factura.periodo_facturacion || 'actual'}.

📋 *Detalles de la Factura:*
• Factura #: ${factura.id}
• Matrícula: ${factura.cod_matricula}
•  Nombre completo: ${nombrePropietario}
• Periodo: ${factura.periodo_facturacion || '-'}
• Valor: ${formatearMoneda(factura.valor)}
• Fecha de vencimiento: ${formatearFecha(factura.fecha_vencimiento)}
• Estado: ${factura.estado}

📄 *Descargue su factura aquí:* https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf

Por favor, realice el pago antes de la fecha de vencimiento para evitar cargos adicionales.

Si tiene alguna pregunta, no dude en contactarnos.

Gracias por su atención.`;

    return mensaje;
  };

  const handleCompartir = () => {
    const mensaje = generarMensaje();
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Si hay teléfono del propietario, usar ese número
    const telefono = factura.matricula?.predio?.propietario?.telefono;
    const url = telefono 
      ? `https://wa.me/${telefono}?text=${mensajeCodificado}`
      : `https://wa.me/?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp con el mensaje
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Si hay URL del PDF, abrirlo también para que el usuario pueda descargarlo y adjuntarlo
    if (factura.url) {
      setTimeout(() => {
        window.open(factura.url, '_blank', 'noopener,noreferrer');
      }, 500);
    }
  };

  return (
    <button
      onClick={handleCompartir}
      className="text-green-600 hover:text-green-800 font-medium"
      title="Compartir por WhatsApp"
      aria-label="Compartir factura por WhatsApp"
    >
      <Share2 size={16} />
    </button>
  );
}
