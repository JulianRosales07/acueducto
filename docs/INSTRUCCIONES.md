# Instrucciones de Instalación y Ejecución

## Requisitos Previos
- Node.js (v16 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Configuración de la Base de Datos

1. Crear la base de datos:
```bash
mysql -u root -p < database/schema.sql
```

2. Cargar datos de prueba (opcional):
```bash
mysql -u root -p < database/seed.sql
```

## Configuración del Backend

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` basado en `.env.example`:
```bash
copy .env.example .env
```

4. Editar `.env` con tus credenciales de MySQL:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=mantenimiento_fontaneria
DB_PORT=3306
```

5. Iniciar el servidor:
```bash
npm run dev
```

El servidor estará corriendo en http://localhost:3000

## Configuración del Frontend

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias (si no se instalaron automáticamente):
```bash
npm install
```

3. Iniciar la aplicación:
```bash
npm run dev
```

La aplicación estará corriendo en http://localhost:5174

## Uso del Sistema

### 1. Nueva Solicitud de Mantenimiento
- Ingresar número de matrícula
- Buscar el predio para ver sus datos
- Seleccionar tipo de mantenimiento
- Ingresar cédula del solicitante
- Seleccionar prioridad
- Agregar observaciones
- Crear solicitud

### 2. Registrar Reporte
- Buscar solicitud por código, matrícula o cédula
- Completar información del trabajo realizado
- Ingresar materiales usados y costo
- Registrar reporte

### 3. Ver Solicitudes
- Lista completa de todas las solicitudes
- Filtros por estado y prioridad
- Información detallada de cada solicitud

## Estructura del Proyecto

```
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── predioRoutes.js
│   │   ├── solicitudRoutes.js
│   │   ├── reporteRoutes.js
│   │   ├── tipoMantenimientoRoutes.js
│   │   └── usuarioRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SolicitudForm.jsx
│   │   │   ├── ReporteForm.jsx
│   │   │   └── SolicitudesList.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
└── docs/
    ├── historias-usuario.md
    └── modelo-er.md
```

## API Endpoints

### Predios
- GET `/api/predios` - Obtener todos los predios
- GET `/api/predios/:matricula` - Obtener predio por matrícula
- POST `/api/predios` - Crear nuevo predio

### Solicitudes
- GET `/api/solicitudes` - Obtener todas las solicitudes
- GET `/api/solicitudes/:codigo` - Obtener solicitud por código
- POST `/api/solicitudes` - Crear nueva solicitud
- GET `/api/solicitudes/buscar/:termino` - Buscar por matrícula, cédula o código

### Reportes
- GET `/api/reportes` - Obtener todos los reportes
- POST `/api/reportes` - Crear nuevo reporte

### Tipos de Mantenimiento
- GET `/api/tipos-mantenimiento` - Obtener tipos activos
- POST `/api/tipos-mantenimiento` - Crear nuevo tipo

### Usuarios
- GET `/api/usuarios` - Obtener todos los usuarios
- GET `/api/usuarios/:cedula` - Obtener usuario por cédula
- POST `/api/usuarios` - Crear nuevo usuario

## Solución de Problemas

### Error de conexión a la base de datos
- Verificar que MySQL esté corriendo
- Verificar credenciales en el archivo `.env`
- Verificar que la base de datos exista

### Error CORS
- Verificar que el backend esté corriendo en el puerto 3000
- Verificar configuración de CORS en `server.js`

### Puerto en uso
- Cambiar el puerto en `.env` (backend) o en vite.config.js (frontend)
