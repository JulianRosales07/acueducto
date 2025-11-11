# ✅ Migración Completada a Supabase

El backend ha sido migrado exitosamente de MySQL a Supabase (PostgreSQL).

## 🎯 Cambios Realizados

### 1. Dependencias Actualizadas
- ❌ Removido: `mysql2`
- ✅ Agregado: `@supabase/supabase-js`

### 2. Configuración de Base de Datos
**Archivo:** `backend/config/database.js`

```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);
```

### 3. Variables de Entorno
**Archivo:** `backend/.env`

```env
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase
```

## 📊 Estructura de la Base de Datos

### Tablas Principales:
1. **usuario** - Usuarios del sistema
2. **propietario** - Propietarios de predios
3. **predio** - Predios/propiedades
4. **matricula** - Matrículas de predios
5. **mantenimiento** - Tipos de mantenimiento
6. **solicitud_mantenimiento** - Solicitudes de mantenimiento
7. **factura** - Facturas generadas
8. **pago** - Pagos realizados

## 🚀 Pasos para Configurar

### 1. Obtener Credenciales de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Tu proyecto ya está creado con las tablas
4. Ve a **Settings** → **API**
5. Copia:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)

### 2. Configurar Variables de Entorno

Edita `backend/.env`:

```env
PORT=3001

SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Desactivar Row Level Security (RLS)

En el SQL Editor de Supabase, ejecuta:

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

**⚠️ Nota:** Esto es para desarrollo. En producción, configura políticas de RLS apropiadas.

### 4. Instalar Dependencias

```bash
cd backend
npm install
```

### 5. Probar Conexión

```bash
npm run test:db
```

Deberías ver:
```
✅ Conexión exitosa a Supabase
✅ usuario: 2 registros
✅ propietario: 2 registros
✅ predio: 2 registros
...
```

### 6. Iniciar el Servidor

```bash
npm start
# o para desarrollo con auto-reload
npm run dev
```

El servidor estará disponible en: `http://localhost:3001`

## 📝 Rutas del API Actualizadas

### Nuevas Rutas:
- ✅ `/api/predios` - Gestión de predios
- ✅ `/api/propietarios` - Gestión de propietarios
- ✅ `/api/usuarios` - Gestión de usuarios
- ✅ `/api/matriculas` - Gestión de matrículas
- ✅ `/api/mantenimientos` - Tipos de mantenimiento
- ✅ `/api/solicitudes` - Solicitudes de mantenimiento
- ✅ `/api/facturas` - Gestión de facturas
- ✅ `/api/pagos` - Gestión de pagos

### Rutas Removidas:
- ❌ `/api/tipos-mantenimiento` (ahora es `/api/mantenimientos`)
- ❌ `/api/reportes` (funcionalidad integrada en solicitudes)
- ❌ `/api/configuracion` (no necesaria en el nuevo esquema)

## 🔄 Diferencias Clave MySQL vs Supabase

### Consultas SELECT
**MySQL:**
```javascript
const [rows] = await pool.query('SELECT * FROM usuario');
```

**Supabase:**
```javascript
const { data, error } = await supabase.from('usuario').select('*');
```

### Consultas con JOIN
**MySQL:**
```javascript
const [rows] = await pool.query(`
  SELECT p.*, prop.nombre 
  FROM predio p 
  JOIN propietario prop ON p.propietario_cc = prop.cc
`);
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('predio')
  .select(`
    *,
    propietario:propietario!fk_predio_propietario (
      nombre,
      apellido
    )
  `);
```

### INSERT
**MySQL:**
```javascript
const [result] = await pool.query(
  'INSERT INTO predio (direccion) VALUES (?)',
  [direccion]
);
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('predio')
  .insert([{ direccion }])
  .select()
  .single();
```

### UPDATE
**MySQL:**
```javascript
await pool.query(
  'UPDATE predio SET direccion = ? WHERE id = ?',
  [direccion, id]
);
```

**Supabase:**
```javascript
await supabase
  .from('predio')
  .update({ direccion })
  .eq('id', id);
```

## ✨ Ventajas de Supabase

1. ✅ **Hosting incluido** - No necesitas servidor de BD propio
2. ✅ **Backups automáticos** - Respaldos diarios automáticos
3. ✅ **API REST automática** - Endpoints generados automáticamente
4. ✅ **Realtime** - Subscripciones en tiempo real disponibles
5. ✅ **Dashboard web** - Interfaz para administrar datos
6. ✅ **PostgreSQL** - Base de datos más robusta que MySQL
7. ✅ **Escalabilidad** - Fácil de escalar según necesidades

## 📁 Archivos Modificados

### Configuración:
- ✅ `backend/config/database.js`
- ✅ `backend/.env`
- ✅ `backend/package.json`
- ✅ `backend/server.js`

### Rutas Actualizadas:
- ✅ `backend/routes/predioRoutes.js`
- ✅ `backend/routes/usuarioRoutes.js`
- ✅ `backend/routes/propietarioRoutes.js` (nueva)
- ✅ `backend/routes/matriculaRoutes.js`
- ✅ `backend/routes/mantenimientoRoutes.js` (nueva)
- ✅ `backend/routes/solicitudRoutes.js`
- ✅ `backend/routes/facturaRoutes.js`
- ✅ `backend/routes/pagoRoutes.js` (nueva)

### Documentación:
- ✅ `backend/API_DOCUMENTATION.md`
- ✅ `backend/test-connection.js`
- ✅ `MIGRACION_SUPABASE.md`

## 🧪 Probar el API

### 1. Obtener todos los predios:
```bash
curl http://localhost:3001/api/predios
```

### 2. Crear un propietario:
```bash
curl -X POST http://localhost:3001/api/propietarios \
  -H "Content-Type: application/json" \
  -d '{
    "cc": "2003",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "3001234567",
    "correo": "juan@correo.com"
  }'
```

### 3. Crear una solicitud:
```bash
curl -X POST http://localhost:3001/api/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "id_predio": 1,
    "id_mantenimiento": 1,
    "observaciones": "Fuga en tubería",
    "prioridad": "Alta"
  }'
```

## 🆘 Solución de Problemas

### Error: "relation does not exist"
- Las tablas no existen en Supabase
- Ejecuta el script SQL proporcionado en el SQL Editor

### Error: "new row violates row-level security policy"
- RLS está activado
- Ejecuta los comandos para desactivar RLS (ver paso 3)

### Error: "Invalid API key"
- Verifica SUPABASE_URL y SUPABASE_ANON_KEY en .env
- Asegúrate de copiar las credenciales correctas desde Supabase

### Error de conexión
- Verifica que el proyecto de Supabase esté activo
- Revisa que no haya errores de tipeo en las credenciales

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## ✅ Estado de la Migración

- ✅ Configuración de Supabase
- ✅ Todas las rutas migradas
- ✅ Documentación actualizada
- ✅ Scripts de prueba actualizados
- ✅ Listo para usar

¡La migración está completa! 🎉
