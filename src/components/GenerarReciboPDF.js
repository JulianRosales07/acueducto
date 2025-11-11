import { jsPDF } from 'jspdf';
import { api } from '../services/api';
import { formatCurrency, formatDate } from './ComponetesGrupo6/lib/formatters';

export const generarReciboPDF = async (factura) => {
  try {
    // Primero, obtener la factura completa con todas sus relaciones
    let facturaCompleta = factura;
    try {
      const single = await api.get(`/facturas/${factura.id}`);
      if (single) {
        facturaCompleta = single;
      }
    } catch (err) {
      console.warn('No se pudo obtener factura completa por id, usando datos locales', err.message || err);
    }

    // Si la factura no tiene los datos de matrícula/predio/propietario, intentar obtenerlos
    if (facturaCompleta.cod_matricula && !facturaCompleta.matricula?.predio?.propietario) {
      try {
        const matriculaData = await api.get(`/matriculas/${facturaCompleta.cod_matricula}`);
        if (matriculaData) {
          facturaCompleta.matricula = matriculaData;
        }
      } catch (err) {
        console.warn('No se pudo obtener datos de matrícula', err.message || err);
      }
    }

    // Intentar obtener todas las facturas de la misma matrícula
    let facturasParaPDF = [facturaCompleta];
    if (facturaCompleta && facturaCompleta.cod_matricula) {
      try {
        const data = await api.get(`/facturas/matricula/${facturaCompleta.cod_matricula}`);
        // `api.get` devuelve JSON directo (fetch wrapper), asumimos que `data` es un array
        if (Array.isArray(data) && data.length > 0) {
          // Enriquecer cada factura con datos de matrícula si no los tiene
          for (let i = 0; i < data.length; i++) {
            if (!data[i].matricula?.predio?.propietario && data[i].cod_matricula) {
              try {
                const matriculaData = await api.get(`/matriculas/${data[i].cod_matricula}`);
                if (matriculaData) {
                  data[i].matricula = matriculaData;
                }
              } catch (err) {
                console.warn(`No se pudo obtener datos de matrícula ${data[i].cod_matricula}`, err.message || err);
              }
            }
          }
          facturasParaPDF = data;
        }
      } catch (err) {
        console.warn('No se pudo obtener facturas por matrícula, se generará solo la factura actual', err.message || err);
      }
    }

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const left = 40;

    // Función que dibuja una factura en la página actual
    const drawFactura = (facturaItem) => {
      // Debug: ver qué datos tenemos disponibles
      console.log('Datos de factura para PDF:', {
        id: facturaItem.id,
        cod_matricula: facturaItem.cod_matricula,
        matricula: facturaItem.matricula,
        predio: facturaItem.matricula?.predio,
        propietario: facturaItem.matricula?.predio?.propietario
      });
      
      let y = 40;
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Sistema de Acueducto', pageWidth / 2, y + 10, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Recibo / Factura', pageWidth / 2, y + 30, { align: 'center' });

      y += 60;
      doc.setLineWidth(0.5);
      doc.line(left, y - 10, pageWidth - left, y - 10);

      // Meta
      doc.setFontSize(10);
      doc.text(`Factura N°: ${facturaItem.id}`, left, y);
      doc.text(`Fecha emisión: ${formatDate(facturaItem.fecha_creacion)}`, left, y + 14);
      doc.text(`Fecha vencimiento: ${formatDate(facturaItem.fecha_vencimiento)}`, left, y + 28);
      doc.text(`Estado: ${facturaItem.estado}`, left, y + 42);

      const rightX = pageWidth - left - 240;
      
      // Extraer datos del propietario de forma segura
      const matricula = facturaItem?.matricula;
      const predio = matricula?.predio;
      const propietario = predio?.propietario;
      
      let propietarioNombre = '-';
      if (propietario) {
        const nombre = propietario.nombre || '';
        const apellido = propietario.apellido || '';
        if (nombre || apellido) {
          propietarioNombre = `${nombre} ${apellido}`.trim();
        }
      }
      
      const propietarioCC = propietario?.cc || '-';
      const direccion = predio?.direccion || '-';

      doc.text(`Matrícula: ${facturaItem.cod_matricula || '-'}`, rightX, y);
      doc.text(`Propietario: ${propietarioNombre}`, rightX, y + 14);
      doc.text(`CC: ${propietarioCC}`, rightX, y + 28);
      doc.text(`Dirección: ${direccion}`, rightX, y + 42);

      y += 70;

      // Tabla de conceptos
      const tableLeft = left;
      const tableRight = pageWidth - left;
      const col1 = tableLeft;
      const col2 = tableLeft + 350;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Descripción', col1, y);
      doc.text('Valor', col2, y, { align: 'right' });
      y += 8;
      doc.setLineWidth(0.5);
      doc.line(tableLeft, y, tableRight, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const descripcion = facturaItem.descripcion || 'Servicio de acueducto';
      const valorTexto = formatCurrency(facturaItem.valor || 0);
      doc.text(descripcion, col1, y);
      doc.text(valorTexto, col2, y, { align: 'right' });
      y += 18;

      if (facturaItem.pagos && facturaItem.pagos.length > 0) {
        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.text('Pagos registrados:', left, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        facturaItem.pagos.forEach((pago, idx) => {
          const pagoFecha = formatDate(pago.fecha_pago);
          const pagoValor = formatCurrency(pago.valor || 0);
          doc.text(`${idx + 1}. ${pagoFecha} - ${pago.metodo_pago || '—'}`, left, y);
          doc.text(pagoValor, col2, y, { align: 'right' });
          y += 14;
        });
      }

      y += 12;
      doc.setLineWidth(0.5);
      doc.line(tableLeft, y, tableRight, y);
      y += 14;
      doc.setFont('helvetica', 'bold');
      doc.text('Total a pagar:', col1, y);
      doc.text(valorTexto, col2, y, { align: 'right' });

      // Footer
      const footerY = 780;
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text('Gracias por su pago oportuno. Documento generado por el Sistema de Acueducto.', pageWidth / 2, footerY, { align: 'center' });
    };

    // Dibujar todas las facturas: una por página
    facturasParaPDF.forEach((f, idx) => {
      if (idx > 0) doc.addPage();
      drawFactura(f);
    });

    const nombre = factura.cod_matricula ? `facturas_matricula_${factura.cod_matricula}.pdf` : `factura_${factura.id}.pdf`;
    doc.save(nombre);
  } catch (err) {
    console.error('Error generando PDF:', err);
    throw err;
  }
};
