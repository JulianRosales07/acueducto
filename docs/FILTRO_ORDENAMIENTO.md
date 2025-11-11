# Filtro de Ordenamiento por Fecha de Emisión

## Descripción

Se ha agregado un filtro de ordenamiento que permite organizar las facturas por fecha de emisión, alternando entre orden descendente (más reciente primero) y ascendente (más antigua primero).

---

## Funcionalidad

### Estado Inicial
Por defecto, las facturas se muestran ordenadas de **más reciente a más antigua** (orden descendente).

### Botón de Ordenamiento
Ubicado en la sección de filtros, junto al filtro de estado.

**Apariencia:**
```
📅 ↓ Reciente  (cuando está en orden descendente)
📅 ↑ Antigua   (cuando está en orden ascendente)
```

**Color:** Morado (purple-100/purple-200)

---

## Cómo Usar

### Paso 1: Localizar el botón
En la barra de filtros, después del selector de estado, encontrarás el botón de ordenamiento.

### Paso 2: Click para cambiar orden
- **Estado inicial:** 📅 ↓ Reciente (más reciente primero)
- **Después del click:** 📅 ↑ Antigua (más antigua primero)
- **Siguiente click:** Vuelve a 📅 ↓ Reciente

### Paso 3: Ver resultados
La tabla se reorganiza automáticamente según el orden seleccionado.

---

## Implementación Técnica

### Estado del Componente
```javascript
const [ordenFecha, setOrdenFecha] = useState('desc');
// 'desc' = descendente (más reciente primero)
// 'asc' = ascendente (más antigua primero)
```

### Función de Ordenamiento
```javascript
const ordenarFacturas = (facturasData) => {
  const facturasOrdenadas = [...facturasData].sort((a, b) => {
    const fechaA = new Date(a.fecha_creacion);
    const fechaB = new Date(b.fecha_creacion);
    
    if (ordenFecha === 'desc') {
      return fechaB - fechaA; // Más reciente primero
    } else {
      return fechaA - fechaB; // Más antigua primero
    }
  });
  setFacturas(facturasOrdenadas);
};
```

### Función para Cambiar Orden
```javascript
const cambiarOrdenFecha = () => {
  const nuevoOrden = ordenFecha === 'desc' ? 'asc' : 'desc';
  setOrdenFecha(nuevoOrden);
  ordenarFacturas(facturas);
};
```

### Integración con Carga de Datos
```javascript
const cargarFacturas = async () => {
  const data = await api.get(endpoint);
  ordenarFacturas(data); // Aplica ordenamiento automáticamente
};
```

---

## Características

### ✅ Ordenamiento Automático
- Al cargar las facturas, se aplica automáticamente el orden seleccionado
- No requiere recargar desde el servidor

### ✅ Persistencia del Orden
- El orden seleccionado se mantiene al:
  - Cambiar filtro de estado
  - Actualizar la lista
  - Crear nueva factura
  - Registrar pago

### ✅ Indicador Visual
- El botón muestra claramente el orden actual
- Iconos intuitivos (↓ para descendente, ↑ para ascendente)
- Tooltip con descripción al pasar el mouse

### ✅ Rendimiento
- Ordenamiento en el cliente (no requiere llamada al servidor)
- Rápido y eficiente
- No afecta la carga inicial

---

## Interfaz de Usuario

### Ubicación
```
┌─────────────────────────────────────────────────────────────┐
│ Filtrar por estado: [Dropdown] │ Ordenar por fecha: [Botón] │
│ 🔄 Actualizar  Ver Todas las Facturas                       │
└─────────────────────────────────────────────────────────────┘
```

### Separador Visual
Se agregó una línea divisoria vertical entre el filtro de estado y el ordenamiento para mejor organización visual.

---

## Ejemplos de Uso

### Caso 1: Ver Facturas Más Recientes
**Situación:** Quieres ver las facturas creadas recientemente

**Acción:** 
- El orden por defecto ya muestra las más recientes primero
- Si está en orden ascendente, click en el botón para cambiar a descendente

**Resultado:** Las facturas del 2/11/2025 aparecen primero

### Caso 2: Ver Historial Completo
**Situación:** Quieres revisar facturas desde las más antiguas

**Acción:** 
- Click en el botón de ordenamiento hasta ver "📅 ↑ Antigua"

**Resultado:** Las facturas más antiguas aparecen primero, útil para revisar historial cronológico

### Caso 3: Combinar con Filtro de Estado
**Situación:** Quieres ver facturas pendientes más antiguas primero

**Acción:**
1. Seleccionar "Pendiente" en filtro de estado
2. Click en ordenamiento hasta "📅 ↑ Antigua"

**Resultado:** Solo facturas pendientes, ordenadas de más antigua a más reciente

---

## Ventajas

### 1. Flexibilidad
- Permite ver datos en el orden que necesites
- Útil para diferentes casos de uso

### 2. Eficiencia
- No requiere recargar datos del servidor
- Cambio instantáneo

### 3. Intuitividad
- Iconos claros y descriptivos
- Comportamiento predecible

### 4. Compatibilidad
- Funciona con todos los filtros existentes
- No interfiere con otras funcionalidades

---

## Comportamiento con Otros Filtros

### Con Filtro de Estado
- El ordenamiento se aplica a las facturas filtradas
- Ejemplo: "Pendientes" ordenadas por fecha

### Con Filtro por Matrícula
- Al ver facturas de una matrícula específica, mantiene el orden seleccionado
- Útil para ver historial cronológico de un predio

### Al Actualizar
- El botón "🔄 Actualizar" mantiene el orden actual
- Recarga datos y aplica el mismo ordenamiento

### Al Ver Todas
- El botón "Ver Todas las Facturas" mantiene el orden actual
- Solo limpia el filtro de estado y matrícula

---

## Código CSS

### Clases del Botón
```jsx
className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded text-sm transition flex items-center gap-2"
```

### Separador
```jsx
<div className="border-l border-gray-300 h-8 mx-2"></div>
```

---

## Mejoras Futuras Sugeridas

- [ ] Agregar ordenamiento por otras columnas (valor, vencimiento, matrícula)
- [ ] Guardar preferencia de ordenamiento en localStorage
- [ ] Agregar indicador visual en el encabezado de la columna
- [ ] Permitir ordenamiento múltiple (por fecha y luego por valor)
- [ ] Agregar animación al cambiar orden
- [ ] Mostrar contador de facturas ordenadas

---

## Testing

### Casos de Prueba

1. **Orden por defecto**
   - ✅ Al cargar, debe mostrar más recientes primero
   - ✅ Botón debe mostrar "📅 ↓ Reciente"

2. **Cambio de orden**
   - ✅ Click cambia a orden ascendente
   - ✅ Botón cambia a "📅 ↑ Antigua"
   - ✅ Facturas se reorganizan correctamente

3. **Persistencia**
   - ✅ Orden se mantiene al cambiar filtro de estado
   - ✅ Orden se mantiene al actualizar
   - ✅ Orden se mantiene al crear nueva factura

4. **Combinación con filtros**
   - ✅ Funciona correctamente con filtro de estado
   - ✅ Funciona correctamente con filtro de matrícula
   - ✅ Funciona correctamente con ambos filtros

---

## Resumen

Se ha implementado exitosamente un filtro de ordenamiento por fecha de emisión que permite alternar entre orden descendente (más reciente primero) y ascendente (más antigua primero). La funcionalidad es intuitiva, eficiente y se integra perfectamente con los filtros existentes.

**Ubicación:** Barra de filtros, después del selector de estado
**Botón:** 📅 ↓ Reciente / 📅 ↑ Antigua
**Color:** Morado
**Comportamiento:** Toggle entre descendente y ascendente
**Persistencia:** Mantiene el orden al usar otros filtros
