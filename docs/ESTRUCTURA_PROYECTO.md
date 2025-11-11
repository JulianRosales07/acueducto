# 📂 Estructura del Proyecto Frontend

## Resumen

Frontend completo en **React + Vite + Tailwind CSS** con:
- ✅ Sistema de rutas configurado
- ✅ Tema claro/oscuro con variables CSS
- ✅ Módulo de Mantenimientos completamente funcional
- ✅ 8 módulos adicionales con estructura lista para implementar

---

## 📁 Archivos Creados

### Configuración Base
```
frontend/
├── index.html                    # HTML principal
├── tailwind.config.js            # Config Tailwind con tema personalizado
├── package.json                  # Dependencias (react-router-dom agregado)
└── vite.config.js               # Config Vite
```

### Código Fuente
```
src/
├── main.jsx                      # Punto de entrada
├── App.jsx                       # Router y layout principal
├── index.css                     # Estilos globales + imports
│
├── theme/
│   └── colors.css               # Variables CSS para tema claro/oscuro
│
├── components/
│   ├── Navbar.jsx               # Barra superior con logo y theme toggle
│   ├── Sidebar.jsx              # Menú lateral con navegación
│   ├── Footer.jsx               # Pie de página
│   └── ThemeToggle.jsx          # Botón cambio de tema 🌙/🌞
│
├── pages/
│   ├── HomePage.jsx             # Dashboard con tarjetas de módulos
│   ├── MantenimientosPage.jsx   # ✅ CRUD COMPLETO
│   ├── PrediosPage.jsx          # Estructura + TODOs
│   ├── UsuariosPage.jsx         # Estructura + TODOs
│   ├── PropietariosPage.jsx     # Estructura + TODOs
│   ├── MatriculasPage.jsx       # Estructura + TODOs
│   ├── SolicitudesPage.jsx      # Estructura + TODOs
│   ├── FacturasPage.jsx         # Estructura + TODOs
│   ├── PagosPage.jsx            # Estructura + TODOs
│   └── NotFoundPage.jsx         # Página 404
│
└── services/
    ├── api.js                    # Cliente HTTP base (GET, POST, PUT, DELETE)
    ├── mantenimientosService.js  # ✅ IMPLEMENTADO
    ├── prediosService.js         # Estructura + TODOs
    ├── usuariosService.js        # Estructura + TODOs
    ├── propietariosService.js    # Estructura + TODOs
    ├── matriculasService.js      # Estructura + TODOs
    ├── solicitudesService.js     # Estructura + TODOs
    ├── facturasService.js        # Estructura + TODOs
    └── pagosService.js           # Estructura + TODOs
```

### Documentación
```
frontend/
├── FRONTEND_README.md           # Documentación completa
├── QUICK_START.md               # Guía rápida de inicio
└── ESTRUCTURA_PROYECTO.md       # Este archivo
```

---

## ✅ Módulo Implementado: Mantenimientos

### Funcionalidades
- ✅ Listar todos los mantenimientos
- ✅ Crear nuevo mantenimiento
- ✅ Editar mantenimiento existente
- ✅ Eliminar mantenimiento
- ✅ Formulario con validación
- ✅ Manejo de estados (loading, error)
- ✅ Diseño responsive
- ✅ Estados visuales con colores (Activo, Completado, Pendiente)

### Campos del Formulario
- Nombre (requerido)
- Descripción (opcional)
- Estado (select: Activo, Inactivo, Pendiente, Completado)
- Fecha (date picker)

### Tabla de Datos
Muestra: ID, Nombre, Descripción, Estado (con badge de color), Fecha, Acciones (Editar/Eliminar)

---

## ⏳ Módulos Pendientes (Estructura Lista)

Cada módulo tiene:
1. ✅ Servicio API con funciones CRUD definidas
2. ✅ Página con estructura base
3. ✅ Comentarios TODOs indicando qué implementar
4. ✅ Ruta configurada en App.jsx
5. ✅ Enlace en el Sidebar

### 1. Predios
**Campos**: ID, Dirección, Propietario CC, Teléfono, Correo, Tipo, Fecha Registro

### 2. Usuarios
**Campos**: CC, Nombre, Apellido, Teléfono, Correo, Fecha Registro

### 3. Propietarios
**Campos**: CC, Nombre, Apellido, Teléfono, Correo

### 4. Matrículas
**Campos**: Código Matrícula, ID Predio, Estado, Fecha

### 5. Solicitudes
**Campos**: ID, ID Mantenimiento, Código Matrícula, Estado, Observaciones, Prioridad

### 6. Facturas
**Campos**: ID, Código Matrícula, Fecha Creación, Fecha Vencimiento, Valor, Estado, URL

### 7. Pagos
**Campos**: ID Factura, Fecha Pago, Método Pago, Valor
**Nota**: Relación 1:1 con Factura

---

## 🎨 Sistema de Temas

### Colores Disponibles en Tailwind

```jsx
// Colores principales
bg-primary        text-primary
bg-secondary      text-secondary
bg-accent         text-accent

// Estados
bg-success        text-success
bg-warning        text-warning
bg-danger         text-danger

// Superficies
bg-background     // Fondo general
bg-surface        // Tarjetas/componentes
bg-muted          // Hover states

// Bordes y texto
border-border
text-text         // Texto principal
text-textMuted    // Texto secundario
```

### Opacidad
```jsx
bg-primary/90     // 90% opacidad
bg-success/20     // 20% opacidad
hover:bg-muted/80 // Hover con opacidad
```

---

## 🔄 Flujo de Datos

```
Componente (Page)
    ↓
Service (API call)
    ↓
api.js (HTTP client)
    ↓
Backend API (Render)
    ↓
Supabase (PostgreSQL)
```

---

## 🚀 Cómo Extender

### Para implementar un nuevo módulo:

1. **Completa el servicio** en `services/[modulo]Service.js`
2. **Implementa la página** en `pages/[Modulo]Page.jsx`
3. **Usa MantenimientosPage.jsx como referencia**
4. **Sigue el mismo patrón**:
   - useState para datos, loading, error
   - useEffect para cargar datos
   - Funciones async para CRUD
   - Formulario con validación
   - Tabla para mostrar datos

### Ejemplo rápido:

```javascript
// 1. Service
export const getPredios = async () => {
  return await api.get("/predios");
};

// 2. Page
const [predios, setPredios] = useState([]);

useEffect(() => {
  loadPredios();
}, []);

const loadPredios = async () => {
  const data = await getPredios();
  setPredios(data);
};
```

---

## 📊 Estadísticas

- **Archivos creados**: 30+
- **Componentes**: 4
- **Páginas**: 9
- **Servicios**: 9
- **Rutas configuradas**: 9
- **Módulos funcionales**: 1 (Mantenimientos)
- **Módulos con estructura**: 7

---

## 🎯 Prioridades Sugeridas

Según las historias de usuario del proyecto:

1. **Alta prioridad**:
   - Solicitudes (HU-01, HU-02)
   - Matrículas (necesario para solicitudes)
   - Predios (necesario para matrículas)

2. **Media prioridad**:
   - Facturas
   - Pagos
   - Usuarios

3. **Baja prioridad**:
   - Propietarios (ya cubierto por usuarios)

---

## 📝 Notas Técnicas

- **React Router v6** - Usando Routes y Route
- **Tailwind JIT** - Compilación just-in-time
- **CSS Variables** - Para tema dinámico
- **Fetch API** - Para llamadas HTTP
- **ES6+ Syntax** - Async/await, destructuring, etc.
- **Responsive Design** - Mobile-first con Tailwind
