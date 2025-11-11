# Selector de Matrículas - Implementación

## ✅ Funcionalidad Implementada

Se ha agregado un sistema completo para buscar y seleccionar matrículas existentes en el sistema.

## Nuevos Endpoints Backend

### 1. Listar todas las matrículas
```
GET /api/predios/matriculas/lista
```
Devuelve todas las matrículas disponibles con su información básica.

**Respuesta:**
```json
[
  {
    "matricula": "MAT-001",
    "direccion": "Calle 10 #20-30",
    "telefono": "3001234567",
    "email": "juan@email.com"
  }
]
```

### 2. Buscar matrículas por término
```
GET /api/predios/matriculas/buscar/:termino
```
Busca matrículas que coincidan con el término en matrícula o dirección.

**Ejemplo:**
```
GET /api/predios/matriculas/buscar/MAT
GET /api/predios/matriculas/buscar/Calle
```

## Nuevo Componente Frontend

### MatriculaSelector.jsx

Componente React reutilizable que proporciona:

**Características:**
- ✅ Búsqueda en tiempo real
- ✅ Autocompletado con dropdown
- ✅ Muestra matrícula y dirección
- ✅ Filtrado local y remoto
- ✅ Interfaz intuitiva
- ✅ Cierre automático al seleccionar

**Uso:**
```jsx
import MatriculaSelector from './MatriculaSelector';

<MatriculaSelector
  value={formData.matricula}
  onChange={(matricula) => setFormData({...formData, matricula})}
  label="Número de Matrícula"
/>
```

**Props:**
- `value`: Valor actual de la matrícula
- `onChange`: Función callback cuando se selecciona una matrícula
- `label`: Etiqueta del campo (opcional, default: "Matrícula")

## Componentes Actualizados

### 1. SolicitudForm.jsx
- ✅ Reemplazado input manual por MatriculaSelector
- ✅ Búsqueda automática de predio al seleccionar
- ✅ Mejor experiencia de usuario

**Antes:**
```jsx
<input type="text" ... />
<button onClick={buscarPredio}>Buscar</button>
```

**Ahora:**
```jsx
<MatriculaSelector
  value={formData.matricula}
  onChange={(matricula) => {
    setFormData({...formData, matricula});
    // Busca automáticamente
  }}
/>
```

### 2. ReporteForm.jsx
El formulario de reportes ya tiene búsqueda por código, matrícula o cédula, que funciona correctamente.

## Cómo Usar

### En el Frontend

1. **Crear Solicitud:**
   - Ve a "Solicitudes" → "Nueva Solicitud"
   - Haz clic en el campo "Número de Matrícula"
   - Verás un dropdown con todas las matrículas
   - Escribe para filtrar (por matrícula o dirección)
   - Selecciona la matrícula deseada
   - La información del predio se carga automáticamente

2. **Registrar Reporte:**
   - Ve a "Reportes" → "Nuevo Reporte"
   - Escribe código de solicitud, matrícula o cédula
   - Haz clic en "Buscar"
   - Completa el formulario

### Probar los Endpoints

```bash
# Listar todas las matrículas
curl http://localhost:3001/api/predios/matriculas/lista

# Buscar matrículas
curl http://localhost:3001/api/predios/matriculas/buscar/MAT
```

## Ventajas

1. **No más errores de escritura**: El usuario selecciona de una lista
2. **Búsqueda rápida**: Filtrado en tiempo real
3. **Información contextual**: Muestra dirección junto con matrícula
4. **Reutilizable**: El componente se puede usar en cualquier formulario
5. **Responsive**: Funciona en móviles y desktop

## Ejemplo Visual

```
┌─────────────────────────────────────────┐
│ Número de Matrícula                     │
├─────────────────────────────────────────┤
│ MAT-001                            ▼    │
└─────────────────────────────────────────┘
  ┌─────────────────────────────────────┐
  │ MAT-001                             │
  │ Calle 10 #20-30                     │
  ├─────────────────────────────────────┤
  │ MAT-002                             │
  │ Carrera 15 #25-40                   │
  ├─────────────────────────────────────┤
  │ MAT-003                             │
  │ Avenida 5 #30-50                    │
  └─────────────────────────────────────┘
```

## Personalización

Puedes personalizar el componente modificando:

**Estilos:**
```jsx
// En MatriculaSelector.jsx
style={{
  backgroundColor: 'white',
  border: '1px solid #ddd',
  // ... más estilos
}}
```

**Comportamiento de búsqueda:**
```jsx
// Cambiar el mínimo de caracteres para buscar
if (term.length < 2) {  // Cambiar este número
  fetchMatriculas();
  return;
}
```

## Troubleshooting

### El dropdown no aparece
- Verifica que el backend esté corriendo
- Revisa la consola del navegador para errores
- Asegúrate de que hay matrículas en la base de datos

### No encuentra matrículas
- Verifica que la tabla `predio` tenga datos
- Asegúrate de que la columna `matricula` no sea NULL
- Ejecuta: `SELECT * FROM predio WHERE matricula IS NOT NULL`

### Error CORS
- Verifica que el backend tenga CORS habilitado
- El servidor debe estar en `http://localhost:3001`
