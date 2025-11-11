# Frontend - Sistema de Acueducto

Frontend en React + Vite + Tailwind CSS para el sistema de gestión de acueducto.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Estilos con tema personalizado
- **Modo Claro/Oscuro** - Sistema de temas con variables CSS

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación superior
│   ├── Sidebar.jsx     # Menú lateral
│   ├── Footer.jsx      # Pie de página
│   └── ThemeToggle.jsx # Botón cambio de tema
│
├── pages/              # Páginas de la aplicación
│   ├── HomePage.jsx
│   ├── PrediosPage.jsx
│   ├── UsuariosPage.jsx
│   ├── PropietariosPage.jsx
│   ├── MatriculasPage.jsx
│   ├── MantenimientosPage.jsx    # ✅ IMPLEMENTADO
│   ├── SolicitudesPage.jsx
│   ├── FacturasPage.jsx
│   ├── PagosPage.jsx
│   └── NotFoundPage.jsx
│
├── services/           # Servicios API
│   ├── api.js                      # Cliente HTTP base
│   ├── mantenimientosService.js    # ✅ IMPLEMENTADO
│   ├── prediosService.js           # TODO
│   ├── usuariosService.js          # TODO
│   ├── propietariosService.js      # TODO
│   ├── matriculasService.js        # TODO
│   ├── solicitudesService.js       # TODO
│   ├── facturasService.js          # TODO
│   └── pagosService.js             # TODO
│
├── theme/
│   └── colors.css      # Variables de color centralizadas
│
├── App.jsx             # Componente principal con rutas
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🎨 Sistema de Temas

El proyecto usa un sistema de colores centralizado con soporte para modo claro/oscuro:

### Variables CSS (theme/colors.css)
- `--color-primary` - Color principal
- `--color-secondary` - Color secundario
- `--color-accent` - Color de acento
- `--color-success` - Verde para éxito
- `--color-warning` - Amarillo para advertencias
- `--color-danger` - Rojo para errores
- `--color-background` - Fondo de la aplicación
- `--color-surface` - Fondo de tarjetas/componentes
- `--color-muted` - Color apagado
- `--color-border` - Color de bordes
- `--color-text` - Texto principal
- `--color-text-muted` - Texto secundario

### Uso en Tailwind
```jsx
<div className="bg-primary text-white">
<button className="bg-success hover:bg-success/90">
<p className="text-textMuted">
```

### Cambiar Tema
El componente `ThemeToggle` alterna la clase `dark` en el elemento `<html>`.

## 🔧 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🌐 API Backend

El frontend consume la API en: `https://acueducto-2.onrender.com/api`

### Endpoints Disponibles
- `/predios` - Gestión de predios
- `/usuarios` - Gestión de usuarios
- `/propietarios` - Gestión de propietarios
- `/matriculas` - Gestión de matrículas
- `/mantenimientos` - Catálogo de mantenimientos ✅
- `/solicitudes` - Solicitudes de mantenimiento
- `/facturas` - Gestión de facturas
- `/pagos` - Gestión de pagos

## ✅ Estado de Implementación

### Completado
- ✅ Estructura base del proyecto
- ✅ Sistema de rutas con React Router
- ✅ Tema claro/oscuro con variables CSS
- ✅ Componentes de layout (Navbar, Sidebar, Footer)
- ✅ **Módulo de Mantenimientos** (CRUD completo)
  - Listar mantenimientos
  - Crear nuevo mantenimiento
  - Editar mantenimiento existente
  - Eliminar mantenimiento
  - Formulario con validación
  - Manejo de errores

### Pendiente (Estructura lista)
- ⏳ Módulo de Predios
- ⏳ Módulo de Usuarios
- ⏳ Módulo de Propietarios
- ⏳ Módulo de Matrículas
- ⏳ Módulo de Solicitudes
- ⏳ Módulo de Facturas
- ⏳ Módulo de Pagos

Todos los módulos pendientes tienen:
- Servicios API definidos con TODOs
- Páginas con estructura base
- Comentarios indicando qué implementar

## 🔨 Cómo Implementar un Módulo

### Ejemplo: Implementar Predios

1. **Completar el servicio** (`services/prediosService.js`):
```javascript
export const getPredios = async () => {
  return await api.get("/predios");
};
```

2. **Implementar la página** (`pages/PrediosPage.jsx`):
```javascript
import { useEffect, useState } from "react";
import { getPredios, createPredio, deletePredio } from "../services/prediosService";

export default function PrediosPage() {
  const [predios, setPredios] = useState([]);
  
  useEffect(() => {
    loadPredios();
  }, []);
  
  const loadPredios = async () => {
    const data = await getPredios();
    setPredios(data);
  };
  
  // ... resto de la implementación
}
```

3. **Seguir el patrón de MantenimientosPage.jsx** como referencia

## 📝 Notas Importantes

- El módulo de **Mantenimientos** está completamente funcional como ejemplo
- Los demás módulos tienen la estructura lista pero requieren implementación
- Todos los servicios usan el cliente HTTP centralizado (`api.js`)
- El tema se persiste automáticamente en el navegador
- Las rutas están configuradas en `App.jsx`

## 🎯 Próximos Pasos

1. Implementar el módulo de **Solicitudes** (alta prioridad según historias de usuario)
2. Implementar **Predios** y **Matrículas** (necesarios para solicitudes)
3. Implementar **Facturas** y **Pagos**
4. Agregar autenticación y autorización
5. Agregar validaciones de formularios
6. Implementar búsqueda y filtros avanzados
7. Agregar paginación para listas grandes
8. Implementar reportes y estadísticas
