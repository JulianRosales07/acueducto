# 🏠 Sistema Predial - Acueducto y Mantenimiento

Sistema completo para la gestión de predios, matrículas, solicitudes de mantenimiento y facturación de servicios de acueducto.

## 🚀 Stack Tecnológico

### Backend
- **Node.js** + **Express** - API REST
- **Supabase** - Base de datos PostgreSQL en la nube
- **@supabase/supabase-js** - Cliente de Supabase

### Frontend
- **React** + **Vite** - Interfaz de usuario
- **TailwindCSS** - Estilos

## 📁 Estructura del Proyecto

```
├── backend/              # API REST
│   ├── config/          # Configuración de Supabase
│   ├── routes/          # Rutas del API
│   ├── server.js        # Servidor principal
│   └── package.json     # Dependencias
│
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   └── App.jsx      # Componente principal
│   └── package.json     # Dependencias
│
├── database/            # Scripts SQL (referencia)
└── docs/               # Documentación

```

## 🎯 Características

### Gestión de Predios
- ✅ Registro de predios con dirección y propietario
- ✅ Búsqueda y filtrado de predios
- ✅ Actualización de información

### Gestión de Matrículas
- ✅ Asignación de matrículas a predios
- ✅ Control de estados (Activa/Inactiva)
- ✅ Historial de matrículas

### Solicitudes de Mantenimiento
- ✅ Creación de solicitudes
- ✅ Asignación de prioridades
- ✅ Seguimiento de estados
- ✅ Observaciones y notas

### Facturación
- ✅ Generación de facturas por matrícula
- ✅ Registro de pagos
- ✅ Control de estados (Pendiente/Pagada/Vencida)
- ✅ Historial de pagos

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 16 o superior
- Cuenta en Supabase (gratuita)
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd sistema-predial
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de Supabase
# SUPABASE_URL=https://tu-proyecto.supabase.co
# SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Configurar Base de Datos

Las tablas ya están creadas en Supabase. Si necesitas recrearlas, el script SQL está en `database/schema.sql`.

**Importante:** Desactiva Row Level Security para desarrollo:
```sql
ALTER TABLE usuario DISABLE ROW LEVEL SECURITY;
ALTER TABLE propietario DISABLE ROW LEVEL SECURITY;
ALTER TABLE predio DISABLE ROW LEVEL SECURITY;
ALTER TABLE matricula DISABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimiento DISABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_mantenimiento DISABLE ROW LEVEL SECURITY;
ALTER TABLE factura DISABLE ROW LEVEL SECURITY;
ALTER TABLE pago DISABLE ROW LEVEL SECURITY;
```

### 4. Iniciar Backend

```bash
cd backend
npm start
```

El servidor estará en: `http://localhost:3001`

### 5. Configurar Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 📡 API Endpoints

### Predios
- `GET /api/predios` - Listar predios
- `POST /api/predios` - Crear predio
- `PUT /api/predios/:id` - Actualizar predio

### Propietarios
- `GET /api/propietarios` - Listar propietarios
- `POST /api/propietarios` - Crear propietario

### Matrículas
- `GET /api/matriculas` - Listar matrículas
- `POST /api/matriculas` - Crear matrícula

### Solicitudes
- `GET /api/solicitudes` - Listar solicitudes
- `POST /api/solicitudes` - Crear solicitud

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `POST /api/facturas/:id/pago` - Registrar pago

Ver documentación completa: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)

## 🌐 Despliegue en Producción

### Backend en Render

**Guías disponibles:**
- 📋 **Inicio rápido:** `INSTRUCCIONES_RENDER.md`
- ✅ **Checklist:** `CHECKLIST_RENDER.md`
- 🔧 **Solución de problemas:** `SOLUCION_ERROR_502_RENDER.md`
- 📚 **Guía completa:** `DESPLIEGUE_RENDER.md`

**Resumen:**
1. Crea un Web Service en Render
2. Configura Root Directory: `backend`
3. Agrega variables de entorno (SUPABASE_URL, SUPABASE_ANON_KEY)
4. Despliega

### Frontend en Vercel/Netlify

1. Conecta tu repositorio
2. Configura Build Command: `npm run build`
3. Configura Output Directory: `dist`
4. Agrega variable de entorno: `VITE_API_URL=https://tu-backend.onrender.com/api`
5. Despliega

## 📚 Documentación

### Backend
- [README del Backend](backend/README.md)
- [Documentación del API](backend/API_DOCUMENTATION.md)
- [Migración a Supabase](MIGRACION_SUPABASE.md)

### Despliegue
- [Instrucciones Render](INSTRUCCIONES_RENDER.md)
- [Checklist de Despliegue](CHECKLIST_RENDER.md)
- [Solución Error 502](SOLUCION_ERROR_502_RENDER.md)

### Base de Datos
- [Esquema SQL](database/schema.sql)
- [Datos de Prueba](database/seed.sql)

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Iniciar con auto-reload
npm run test:db    # Probar conexión a Supabase
```

### Frontend
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm run preview    # Vista previa de producción
```

## 🐛 Solución de Problemas

### Error 502 en Render
→ Ver `SOLUCION_ERROR_502_RENDER.md`

### Error de conexión a Supabase
→ Verifica las credenciales en `.env`

### Frontend no conecta con Backend
→ Actualiza la URL en `frontend/src/config.js`

## 🔐 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ CORS configurado
- ✅ Validación de datos en el backend
- ⚠️ RLS desactivado (solo para desarrollo)

**Para producción:**
- Configura políticas de RLS en Supabase
- Implementa autenticación
- Valida todos los inputs
- Usa HTTPS

## 📊 Base de Datos

### Tablas Principales
1. **usuario** - Usuarios del sistema
2. **propietario** - Propietarios de predios
3. **predio** - Predios/propiedades
4. **matricula** - Matrículas de predios
5. **mantenimiento** - Tipos de mantenimiento
6. **solicitud_mantenimiento** - Solicitudes
7. **factura** - Facturas
8. **pago** - Pagos

Ver esquema completo: [database/schema.sql](database/schema.sql)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la documentación en `/docs`
2. Consulta las guías de despliegue
3. Revisa los logs del servidor

---

**Última actualización:** Sistema migrado a Supabase
**Versión:** 3.0
