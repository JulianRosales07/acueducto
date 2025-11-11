# 🚀 Guía Rápida - Frontend

## Iniciar el Proyecto

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🧪 Probar el Módulo de Mantenimientos

1. Abre el navegador en `http://localhost:5173`
2. Haz clic en **"Mantenimientos"** en el menú lateral
3. Prueba las siguientes funciones:
   - ✅ Ver lista de mantenimientos
   - ✅ Crear nuevo mantenimiento
   - ✅ Editar mantenimiento existente
   - ✅ Eliminar mantenimiento

## 🎨 Cambiar Tema

Haz clic en el botón 🌙/🌞 en la esquina superior derecha para alternar entre modo claro y oscuro.

## 📋 Módulos Disponibles

| Módulo | Ruta | Estado |
|--------|------|--------|
| Inicio | `/` | ✅ Listo |
| Predios | `/predios` | ⏳ Estructura |
| Usuarios | `/usuarios` | ⏳ Estructura |
| Propietarios | `/propietarios` | ⏳ Estructura |
| Matrículas | `/matriculas` | ⏳ Estructura |
| **Mantenimientos** | `/mantenimientos` | ✅ **COMPLETO** |
| Solicitudes | `/solicitudes` | ⏳ Estructura |
| Facturas | `/facturas` | ⏳ Estructura |
| Pagos | `/pagos` | ⏳ Estructura |

## 🔗 API Backend

El frontend se conecta a: `https://acueducto-2.onrender.com/api`

Si necesitas cambiar la URL del backend, edita: `frontend/src/services/api.js`

```javascript
const BASE_URL = "https://acueducto-2.onrender.com/api";
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Vista previa
npm run preview

# Linter
npm run lint
```

## 📦 Dependencias Principales

- `react` - Biblioteca de UI
- `react-router-dom` - Enrutamiento
- `tailwindcss` - Estilos
- `vite` - Build tool

## 🐛 Solución de Problemas

### Error de conexión con el backend
- Verifica que el backend esté corriendo en Render
- Revisa la consola del navegador para errores CORS
- Confirma que la URL en `api.js` sea correcta

### Estilos no se aplican
- Ejecuta `npm run dev` de nuevo
- Limpia la caché del navegador
- Verifica que `tailwind.config.js` esté configurado correctamente

### Rutas no funcionan
- Verifica que `react-router-dom` esté instalado
- Revisa que `App.jsx` tenga el `<Router>` configurado
