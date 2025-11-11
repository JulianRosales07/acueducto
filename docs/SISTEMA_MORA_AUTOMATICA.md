# Sistema de Mora Automática

## Descripción

Sistema automático que detecta y actualiza facturas vencidas al estado "en_mora" sin intervención manual del usuario.

---

## Funcionamiento

### Proceso Automático

1. **Al cargar la página de facturas**
   - Se ejecuta automáticamente la función `actualizarFacturasEnMora()`
   - Esta función llama al endpoint `/facturas/actualizar-mora`
   - El backend busca todas las facturas vencidas
   - Actualiza su estado a "en_mora"
   - Luego se cargan las facturas actualizadas

2. **Criterios para estado "en_mora"**
   - Estado actual: "Pendiente" o "Vencida"
   - Fecha de vencimiento menor a la fecha actual
   - No está pagada

3. **Proceso silencioso**
   - Se ejecuta en segundo plano
   - No muestra mensajes al usuario
   - No interrumpe la experiencia de usuario
   - Los errores se registran en consola pero no se muestran

---

## Implementación Backend

### Endpoint: POST /facturas/actualizar-mora

**Ubicación:** `backend/routes/facturaRoutes.js`

**Código:**
```javascript
router.post('/actualizar-mora', async (req, res) => {
  try {
    const fecha_actual = new Date().toISOString().split('T')[0];
    
    // Buscar facturas vencidas que no estén pagadas
    const { data: facturasVencidas, error: errorBusqueda } = await supabase
      .from('factura')
      .select('id, cod_matricula, fecha_vencimiento, valor')
      .in('estado', ['Pendiente', 'Vencida'])
      .lt('fecha_vencimiento', fecha_actual);
    
    if (errorBusqueda) throw errorBusqueda;
    
    if (!facturasVencidas || facturasVencidas.length === 0) {
      return res.json({
        message: 'No hay facturas vencidas para actualizar',
        facturas_actualizadas: 0
      });
    }
    
    // Actualizar estado a "en_mora"
    const facturasActualizadas = [];
    
    for (const factura of facturasVencidas) {
      const { error: errorActualizar } = await supabase
        .from('factura')
        .update({ estado: 'en_mora' })
        .eq('id', factura.id);
      
      if (!errorActualizar) {
        facturasActualizadas.push(factura.id);
      }
    }
    
    res.json({
      message: 'Facturas actualizadas a estado en mora',
      facturas_actualizadas: facturasActualizadas.length,
      ids: facturasActualizadas
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Respuesta:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 5,
  "ids": [3, 4, 5, 6, 7]
}
```

---

## Implementación Frontend

### Función: actualizarFacturasEnMora()

**Ubicación:** `frontend/src/pages/FacturasPage.jsx`

**Código:**
```javascript
const actualizarFacturasEnMora = async () => {
  try {
    // Actualizar facturas vencidas a estado "en_mora" automáticamente
    await api.post('/facturas/actualizar-mora');
  } catch (err) {
    console.error('Error al actualizar facturas en mora:', err);
    // No mostramos error al usuario, es un proceso en segundo plano
  }
};
```

**Integración con useEffect:**
```javascript
useEffect(() => {
  actualizarFacturasEnMora();  // Primero actualiza estados
  cargarFacturas();             // Luego carga las facturas
  cargarMatriculas();
}, [filtroEstado]);
```

---

## Estados de Factura

### Flujo de Estados

```
Pendiente → Vencida → en_mora → Pagada
    ↓                              ↑
    └──────────────────────────────┘
```

### Descripción de Estados

1. **Pendiente**
   - Factura creada
   - Fecha de vencimiento no superada
   - No pagada

2. **Vencida**
   - Fecha de vencimiento superada
   - No pagada
   - Estado transitorio (se actualiza a "en_mora" automáticamente)

3. **en_mora**
   - Fecha de vencimiento superada
   - No pagada
   - Detectada por el sistema automático
   - Puede generar intereses moratorios

4. **Pagada**
   - Pago registrado y completo
   - Estado final

---

## Colores en la Interfaz

```javascript
const obtenerColorEstado = (estado) => {
  const colores = {
    'Pendiente': 'bg-yellow-100 text-yellow-800',   // Amarillo
    'Pagada': 'bg-green-100 text-green-800',        // Verde
    'Vencida': 'bg-red-100 text-red-800',           // Rojo claro
    'en_mora': 'bg-red-200 text-red-900'            // Rojo oscuro
  };
  return colores[estado] || 'bg-gray-100 text-gray-800';
};
```

**Visualización:**
- 🟡 **Pendiente** - Amarillo suave
- 🟢 **Pagada** - Verde suave
- 🔴 **Vencida** - Rojo claro
- 🔴 **en_mora** - Rojo oscuro (más intenso)

---

## Casos de Uso

### Caso 1: Factura recién vencida

**Situación:**
- Factura con vencimiento: 01/11/2025
- Fecha actual: 02/11/2025
- Estado actual: "Pendiente"

**Proceso:**
1. Usuario abre página de facturas
2. Sistema ejecuta `actualizarFacturasEnMora()`
3. Backend detecta que la factura está vencida
4. Actualiza estado a "en_mora"
5. Usuario ve la factura con estado "en_mora" en rojo oscuro

### Caso 2: Múltiples facturas vencidas

**Situación:**
- 5 facturas con vencimiento anterior a hoy
- Estados actuales: 3 "Pendiente", 2 "Vencida"

**Proceso:**
1. Sistema detecta las 5 facturas vencidas
2. Actualiza todas a "en_mora"
3. Retorna: `{ facturas_actualizadas: 5, ids: [3,4,5,6,7] }`
4. Usuario ve todas con estado "en_mora"

### Caso 3: Sin facturas vencidas

**Situación:**
- Todas las facturas están al día o pagadas

**Proceso:**
1. Sistema busca facturas vencidas
2. No encuentra ninguna
3. Retorna: `{ message: 'No hay facturas vencidas para actualizar', facturas_actualizadas: 0 }`
4. No se realiza ningún cambio

---

## Ventajas del Sistema

### ✅ Automático
- No requiere intervención manual
- Se ejecuta cada vez que se carga la página
- Mantiene los estados actualizados

### ✅ Silencioso
- No interrumpe al usuario
- Proceso transparente
- Errores no bloquean la aplicación

### ✅ Eficiente
- Solo actualiza facturas que lo necesitan
- Consulta optimizada con filtros
- Proceso rápido

### ✅ Confiable
- Usa fecha del servidor
- Criterios claros y consistentes
- Manejo de errores robusto

### ✅ Visual
- Estados con colores distintivos
- Fácil identificación de facturas en mora
- Interfaz intuitiva

---

## Integración con Otras Funcionalidades

### Con Generación Masiva de Facturas

Cuando se generan facturas masivas, el sistema:
1. Detecta facturas anteriores en mora
2. Calcula intereses moratorios (3% mensual)
3. Suma la mora al valor de la nueva factura
4. Actualiza facturas anteriores a estado "Vencida"

**Nota:** El estado "en_mora" se asigna automáticamente después, cuando el usuario accede a la página.

### Con Registro de Pagos

Cuando se registra un pago:
1. Si el pago cubre el total, estado cambia a "Pagada"
2. Si es pago parcial, mantiene estado actual ("en_mora" si aplica)
3. El sistema calcula automáticamente el total pagado

### Con Filtros

El filtro de estado incluye "en_mora":
```html
<option value="en_mora">En Mora</option>
```

Permite ver solo facturas en mora para gestión de cobros.

---

## Frecuencia de Actualización

### Cuándo se ejecuta:

1. **Al cargar la página** - Primera vez
2. **Al cambiar filtro de estado** - Cada cambio
3. **Al actualizar manualmente** - Click en "🔄 Actualizar"
4. **Al crear nueva factura** - Después de crear
5. **Al registrar pago** - Después de registrar

### No se ejecuta:

- En segundo plano mientras la página está abierta
- De forma programada (cron job)
- Al cambiar de pestaña

**Recomendación:** Para sistemas en producción, considerar implementar un cron job que ejecute la actualización periódicamente (ej: cada hora).

---

## Monitoreo y Logs

### En Consola del Navegador

Si hay error:
```
Error al actualizar facturas en mora: [mensaje de error]
```

### En Respuesta del Servidor

Éxito:
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 3,
  "ids": [5, 7, 9]
}
```

Sin facturas:
```json
{
  "message": "No hay facturas vencidas para actualizar",
  "facturas_actualizadas": 0
}
```

---

## Testing

### Pruebas Manuales

1. **Crear factura con vencimiento pasado**
   ```javascript
   {
     cod_matricula: "M001",
     fecha_vencimiento: "2025-10-01", // Fecha pasada
     valor: 50000
   }
   ```

2. **Recargar página de facturas**
   - Verificar que el estado cambió a "en_mora"
   - Verificar color rojo oscuro

3. **Filtrar por "En Mora"**
   - Verificar que aparece la factura
   - Verificar que solo muestra facturas en mora

### Pruebas con Postman/Thunder Client

**Request:**
```
POST http://localhost:3001/api/facturas/actualizar-mora
```

**Response esperada:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 2,
  "ids": [3, 5]
}
```

---

## Mejoras Futuras

- [ ] Cron job para actualización automática cada hora
- [ ] Notificaciones por email de facturas en mora
- [ ] Dashboard con estadísticas de mora
- [ ] Cálculo automático de intereses moratorios
- [ ] Historial de cambios de estado
- [ ] Alertas para administradores
- [ ] Reportes de facturas en mora
- [ ] Integración con sistema de cobros
- [ ] Recordatorios automáticos antes del vencimiento
- [ ] Configuración de días de gracia antes de mora

---

## Resumen

El sistema de mora automática mantiene actualizados los estados de las facturas sin intervención manual, detectando automáticamente facturas vencidas y actualizándolas a estado "en_mora" cada vez que se carga la página de facturas. El proceso es silencioso, eficiente y proporciona una visualización clara con colores distintivos para facilitar la gestión de cobros.

**Estado:** ✅ Implementado y funcional
**Ubicación Backend:** `POST /facturas/actualizar-mora`
**Ubicación Frontend:** `actualizarFacturasEnMora()` en FacturasPage.jsx
**Ejecución:** Automática al cargar página
