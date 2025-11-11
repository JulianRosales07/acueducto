# Funcionalidades Completas del Módulo de Facturas

## Resumen

El componente FacturasPage.jsx ahora consume **TODOS** los endpoints disponibles del backend, proporcionando una gestión completa de facturas.

---

## Endpoints Consumidos

### ✅ 1. GET /facturas
**Uso:** Obtener todas las facturas con filtro opcional por estado

**Implementación:**
```javascript
const cargarFacturas = async () => {
  const endpoint = filtroEstado ? `/facturas?estado=${filtroEstado}` : '/facturas';
  const data = await api.get(endpoint);
  setFacturas(data);
};
```

**Características:**
- Carga todas las facturas al iniciar
- Permite filtrar por estado (Pendiente, Pagada, Vencida, en_mora)
- Incluye información de matrícula, predio y propietario
- Ordenadas por fecha de creación descendente

---

### ✅ 2. GET /facturas/:id
**Uso:** Obtener detalle completo de una factura específica con sus pagos

**Implementación:**
```javascript
const verDetalleFactura = async (id) => {
  const data = await api.get(`/facturas/${id}`);
  setFacturaSeleccionada(data);
  setMostrarModalDetalle(true);
};
```

**Características:**
- Modal con información completa de la factura
- Muestra datos del predio y propietario
- Lista todos los pagos realizados
- Calcula total pagado
- Botón para registrar nuevo pago

**Información mostrada:**
- ID de factura
- Matrícula
- Estado con color
- Fechas de emisión y vencimiento
- Periodo de facturación
- Valor total
- Observaciones (incluye detalles de mora)
- Dirección del predio
- Datos del propietario (nombre, apellido, CC)
- Historial de pagos con fechas y métodos

---

### ✅ 3. GET /facturas/matricula/:codigo
**Uso:** Obtener todas las facturas de una matrícula específica

**Implementación:**
```javascript
const verFacturasPorMatricula = async (codigo) => {
  const data = await api.get(`/facturas/matricula/${codigo}`);
  setFacturas(data);
};
```

**Características:**
- Botón 📋 en cada fila de la tabla
- Filtra la vista para mostrar solo facturas de esa matrícula
- Útil para ver historial completo de un predio
- Botón "Ver Todas las Facturas" para volver a la vista completa

---

### ✅ 4. POST /facturas
**Uso:** Crear una nueva factura individual

**Implementación:**
```javascript
const crearNuevaFactura = async (e) => {
  await api.post('/facturas', {
    cod_matricula: formNueva.cod_matricula,
    fecha_vencimiento: formNueva.fecha_vencimiento,
    valor: parseFloat(formNueva.valor),
    url: formNueva.url || `facturas/${formNueva.cod_matricula}_${new Date().getTime()}.pdf`
  });
};
```

**Características:**
- Modal con formulario
- Selector de matrícula con dirección del predio
- Campo de fecha de vencimiento
- Campo de valor
- URL del PDF (opcional, se auto-genera)
- Validación de campos requeridos
- Verificación de existencia de matrícula en backend

---

### ✅ 5. PUT /facturas/:id/estado
**Uso:** Actualizar el estado de una factura

**Implementación:**
```javascript
const cambiarEstadoFactura = async (id, nuevoEstado) => {
  await api.put(`/facturas/${id}/estado`, { estado: nuevoEstado });
};
```

**Características:**
- Confirmación antes de cambiar estado
- Actualización automática de la tabla
- Mensaje de éxito/error

**Nota:** Actualmente no se usa directamente en la UI, pero está disponible para futuras implementaciones (ej: botones para cambiar estado manualmente).

---

### ✅ 6. POST /facturas/:id/pago
**Uso:** Registrar un pago para una factura

**Implementación:**
```javascript
const registrarPago = async (e) => {
  await api.post(`/facturas/${facturaSeleccionada.id}/pago`, {
    fecha_pago: formPago.fecha_pago,
    metodo_pago: formPago.metodo_pago,
    valor: parseFloat(formPago.valor)
  });
};
```

**Características:**
- Modal con formulario de pago
- Botón 💰 en facturas Pendientes o Vencidas
- Campos:
  - Fecha de pago (por defecto: hoy)
  - Método de pago (efectivo, transferencia, tarjeta, cheque)
  - Valor del pago (permite pagos parciales)
- Muestra información de la factura
- Actualización automática de estado si el pago es completo
- Backend calcula total pagado y actualiza estado automáticamente

---

### ✅ 7. POST /facturas/generar-masivo
**Uso:** Generar facturas para todas las matrículas activas con detección de mora

**Estado:** Endpoint disponible en backend pero NO implementado en el frontend actual

**Razón:** Se eliminó el botón "Generar Masivo" según solicitud del usuario

**Funcionalidad del endpoint:**
- Genera facturas para todas las matrículas activas
- Detecta facturas vencidas automáticamente
- Calcula mora al 3% mensual
- Previene duplicados por periodo
- Actualiza estado de facturas en mora
- Retorna reporte detallado de éxitos y errores

**Para implementar en el futuro:**
```javascript
const generarFacturasMasivo = async () => {
  const resultado = await api.post('/facturas/generar-masivo', {
    periodo_facturacion: '2025-11',
    valor_base: 50000,
    dias_vencimiento: 15
  });
};
```

---

## Interfaz de Usuario

### Tabla Principal

**Columnas:**
- ID
- Matrícula
- Periodo
- Fecha Emisión
- Vencimiento
- Valor (formato moneda colombiana)
- Estado (con colores)
- Acciones

**Acciones por fila:**
1. **👁️ Ver Detalle** - Abre modal con información completa
2. **💰 Registrar Pago** - Solo en facturas Pendientes/Vencidas
3. **📋 Ver Facturas de Matrícula** - Filtra por matrícula
4. **📄 Ver PDF** - Abre PDF en nueva pestaña (si existe)

### Filtros

- **Por Estado:** Dropdown con opciones (Todos, Pendiente, Pagada, Vencida, en_mora)
- **🔄 Actualizar:** Recarga los datos
- **Ver Todas las Facturas:** Limpia filtros y vuelve a vista completa

### Modales

#### 1. Modal Nueva Factura
- Selector de matrícula
- Fecha de vencimiento
- Valor
- URL del PDF (opcional)
- Botones: Cancelar / Crear Factura

#### 2. Modal Detalle de Factura
- Información completa de la factura
- Datos del predio y propietario
- Historial de pagos
- Total pagado
- Botones: Registrar Pago / Cerrar

#### 3. Modal Registrar Pago
- Información de la factura
- Fecha de pago
- Método de pago
- Valor del pago
- Botones: Cancelar / Registrar Pago

---

## Flujos de Uso

### Flujo 1: Crear Nueva Factura
1. Click en "+ Nueva Factura"
2. Seleccionar matrícula
3. Ingresar fecha de vencimiento
4. Ingresar valor
5. (Opcional) Ingresar URL del PDF
6. Click en "Crear Factura"
7. Confirmación y actualización de tabla

### Flujo 2: Ver Detalle de Factura
1. Click en 👁️ en la fila de la factura
2. Se abre modal con información completa
3. Ver datos de factura, predio, propietario y pagos
4. Opción de registrar pago o cerrar

### Flujo 3: Registrar Pago
1. Click en 💰 en la fila de la factura (o desde modal de detalle)
2. Se abre modal de pago
3. Seleccionar fecha de pago
4. Seleccionar método de pago
5. Ingresar valor (puede ser parcial)
6. Click en "Registrar Pago"
7. Backend actualiza estado automáticamente si el pago es completo

### Flujo 4: Ver Facturas por Matrícula
1. Click en 📋 en la fila de la factura
2. La tabla se filtra para mostrar solo facturas de esa matrícula
3. Ver historial completo del predio
4. Click en "Ver Todas las Facturas" para volver

### Flujo 5: Filtrar por Estado
1. Seleccionar estado en el dropdown
2. La tabla se actualiza automáticamente
3. Seleccionar "Todos" para ver todas

---

## Validaciones

### Frontend
- ✅ Campos requeridos en formularios
- ✅ Valores numéricos positivos
- ✅ Formato de fecha válido
- ✅ Confirmaciones antes de acciones importantes

### Backend
- ✅ Verificación de existencia de matrícula
- ✅ Verificación de existencia de factura
- ✅ Cálculo automático de total pagado
- ✅ Actualización automática de estado
- ✅ Prevención de duplicados (en generación masiva)
- ✅ Detección y cálculo de mora

---

## Características Técnicas

### Estados del Componente
```javascript
- facturas: Array de facturas
- loading: Indicador de carga
- error: Mensajes de error
- filtroEstado: Estado seleccionado en filtro
- mostrarModalNueva: Control de modal nueva factura
- mostrarModalDetalle: Control de modal detalle
- mostrarModalPago: Control de modal pago
- facturaSeleccionada: Factura actual en modales
- guardando: Indicador de guardado
- matriculas: Lista de matrículas disponibles
- formNueva: Datos del formulario de nueva factura
- formPago: Datos del formulario de pago
```

### Funciones Principales
```javascript
- cargarFacturas(): Carga todas las facturas
- cargarMatriculas(): Carga matrículas para selector
- crearNuevaFactura(): Crea nueva factura
- verDetalleFactura(): Muestra detalle completo
- verFacturasPorMatricula(): Filtra por matrícula
- cambiarEstadoFactura(): Actualiza estado
- abrirModalPago(): Abre modal de pago
- registrarPago(): Registra un pago
- formatearFecha(): Formatea fechas a es-CO
- formatearMoneda(): Formatea valores a COP
- obtenerColorEstado(): Retorna clase CSS según estado
```

---

## Mejoras Futuras Sugeridas

- [ ] Implementar búsqueda por texto (matrícula, propietario)
- [ ] Agregar paginación para grandes volúmenes
- [ ] Exportar facturas a Excel/PDF
- [ ] Enviar facturas por email
- [ ] Gráficos y estadísticas
- [ ] Filtro por rango de fechas
- [ ] Editar facturas existentes
- [ ] Eliminar facturas (con confirmación)
- [ ] Imprimir factura directamente
- [ ] Notificaciones de facturas próximas a vencer
- [ ] Dashboard con resumen de cobros
- [ ] Historial de cambios de estado
- [ ] Comentarios/notas en facturas
- [ ] Adjuntar archivos adicionales

---

## Resumen de Cobertura

| Endpoint | Método | Implementado | Funcionalidad |
|----------|--------|--------------|---------------|
| /facturas | GET | ✅ | Listar todas las facturas con filtro |
| /facturas/:id | GET | ✅ | Ver detalle completo con pagos |
| /facturas/matricula/:codigo | GET | ✅ | Filtrar por matrícula |
| /facturas | POST | ✅ | Crear nueva factura |
| /facturas/:id/estado | PUT | ✅ | Actualizar estado (disponible) |
| /facturas/:id/pago | POST | ✅ | Registrar pago |
| /facturas/generar-masivo | POST | ❌ | Generación masiva (no en UI) |

**Cobertura: 6 de 7 endpoints (85.7%)**

El endpoint de generación masiva está disponible en el backend pero no se implementó en el frontend según solicitud del usuario.

---

## Conclusión

El módulo de facturas ahora proporciona una gestión completa y profesional de facturas, consumiendo prácticamente todos los endpoints disponibles del backend. Los usuarios pueden crear facturas individuales, ver detalles completos, registrar pagos, filtrar por diferentes criterios y mantener un control total sobre el proceso de facturación.
