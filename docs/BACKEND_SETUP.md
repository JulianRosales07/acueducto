# Backend Actualizado - Sistema de Acueducto

## ✅ Implementación Completada

El backend ha sido actualizado para consumir la nueva estructura de base de datos con soporte completo para todas las historias de usuario.

## 📁 Archivos Creados/Actualizados

### Nuevas Rutas
1. **`backend/routes/matriculaRoutes.js`** - Gestión de matrículas
2. **`backend/routes/facturaRoutes.js`** - Facturación y pagos
3. **`backend/routes/configuracionRoutes.js`** - Configuración del sistema

### Rutas Actualizadas
1. **`backend/routes/predioRoutes.js`** - Adaptado al nuevo esquema
2. **`backend/routes/usuarioRoutes.js`** - Agregado campo dirección
3. **`backend/routes/solicitudRoutes.js`** - Usa matrículas en lugar de predios directos

### Archivos de Configuración
1. **`backend/server.js`** - Agregadas nuevas rutas
2. **`backend/test-connection.js`** - Script de prueba de conexión
3. **`backend/API_DOCUMENTATION.md`** - Documentación completa de endpoints
4. **`backend/README.md`** - Guía de uso del backend

## 🚀 Cómo Usar

### 1. Configurar Base de Datos
```bash
cd database
setup.bat
```

### 2. Instalar Dependencias
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
Editar `backend/.env` con tus credenciales de MySQL

### 4. Probar Conexión
```bash
npm run test:db
```

### 5. Iniciar Servidor
```bash
npm run dev
```

El servidor estará en `http://localhost:3001`

## 📋 Endpoints Principales

### Matrículas (Historia 4 y 5)
```
GET    /api/matriculas                    # Listar todas
GET    /api/matriculas/numero/:numero     # Por número
GET    /api/matriculas/usuario/:cedula    # Por usuario
POST   /api/matriculas                    # Crear
PUT    /api/matriculas/:numero/estado     # Actualizar estado
```

### Facturas (Historia 1 y 3)
```
GET    /api/facturas                      # Listar todas
GET    /api/facturas/codigo/:codigo       # Por código (con detalles)
GET    /api/facturas/usuario/:cedula      # Por usuario
GET    /api/facturas/matricula/:numero    # Por matrícula
POST   /api/facturas/generar              # Generar facturas masivas
POST   /api/facturas/:codigo/pago         # Registrar pago
POST   /api/facturas/actualizar-estados   # Actualizar estados
```

### Solicitudes (Historia 6)
```
GET    /api/solicitudes                   # Listar todas
GET    /api/solicitudes/:codigo           # Por código
POST   /api/solicitudes                   # Crear
PUT    /api/solicitudes/:codigo/estado    # Actualizar estado
GET    /api/solicitudes/buscar/:termino   # Buscar
```

### Reportes (Historia 7)
```
GET    /api/reportes                      # Listar todos
GET    /api/reportes/:id                  # Por ID
POST   /api/reportes                      # Crear
GET    /api/reportes/buscar/:termino      # Buscar
```

## 🎯 Funcionalidades Implementadas

### ✅ Historia 1: Facturar
- Generación masiva de facturas para todas las matrículas
- Validación automática de facturas en mora
- Cálculo de mora basado en configuración
- Incorporación de pagos pendientes

### ✅ Historia 3: Consultar/Descargar Factura
- Búsqueda por código de factura
- Búsqueda por cédula (todas las facturas del usuario)
- Incluye detalles completos de la factura

### ✅ Historia 4: Generación de Matrícula
- Crear matrícula sobre un predio
- Asociar a un usuario propietario
- Validación: un predio solo puede tener una matrícula activa

### ✅ Historia 5: Consulta de Matrículas
- Por número de matrícula
- Por cédula (todas las matrículas del usuario)

### ✅ Historia 6: Solicitud de Mantenimiento
- Registrar solicitud para una matrícula
- Seleccionar tipo de mantenimiento
- Agregar observaciones y prioridad

### ✅ Historia 7: Reporte de Mantenimiento
- Registrar trabajo realizado
- Búsqueda por código, matrícula o cédula
- Materiales y costos

## 🔧 Características Técnicas

### Transacciones
- Generación de facturas usa transacciones
- Registro de pagos con actualización automática de estado

### Validaciones
- Verificación de existencia de registros relacionados
- Validación de estados (matrículas activas, etc.)
- Integridad referencial

### Cálculos Automáticos
- Mora calculada según porcentaje configurado
- Subtotales y totales de facturas
- Fechas de vencimiento según días configurados

### Joins Optimizados
- Consultas con información completa
- Índices para mejorar rendimiento
- Datos relacionados en una sola consulta

## 📝 Ejemplos de Uso

### Crear Matrícula
```bash
curl -X POST http://localhost:3001/api/matriculas \
  -H "Content-Type: application/json" \
  -d '{
    "numero_matricula": "MAT-2025-006",
    "id_predio": 1,
    "cedula_propietario": "1001234567",
    "observaciones": "Nueva matrícula"
  }'
```

### Generar Facturas
```bash
curl -X POST http://localhost:3001/api/facturas/generar \
  -H "Content-Type: application/json" \
  -d '{
    "periodo_facturacion": "2025-02",
    "consumos": {
      "MAT-2025-001": 8.5,
      "MAT-2025-002": 6.2
    }
  }'
```

### Consultar Facturas de Usuario
```bash
curl http://localhost:3001/api/facturas/usuario/1001234567
```

### Crear Solicitud
```bash
curl -X POST http://localhost:3001/api/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "numero_matricula": "MAT-2025-001",
    "id_tipo": 1,
    "cedula_solicitante": "1002345678",
    "observaciones": "Fuga en el baño",
    "prioridad": "alta"
  }'
```

## 🔍 Testing

Probar todos los endpoints:
```bash
# Listar matrículas
curl http://localhost:3001/api/matriculas

# Listar facturas
curl http://localhost:3001/api/facturas

# Obtener configuración
curl http://localhost:3001/api/configuracion

# Listar solicitudes
curl http://localhost:3001/api/solicitudes
```

## 📚 Próximos Pasos

Para completar las historias de usuario:

1. **Historia 2**: Implementar generación de PDF de facturas
   - Usar librería como `pdfkit` o `puppeteer`
   - Crear template con logo y diseño

2. **Frontend**: Actualizar componentes React para usar nuevos endpoints

3. **Autenticación**: Agregar JWT para seguridad

4. **Validaciones**: Agregar más validaciones de negocio

## 🐛 Troubleshooting

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Revisar credenciales en `.env`
- Verificar que la base de datos exista

### Error "Table doesn't exist"
- Ejecutar `database/setup.bat` para crear tablas
- Verificar que el nombre de la base de datos sea correcto

### Puerto en uso
- Cambiar `PORT` en `.env`
- O detener el proceso que usa el puerto 3001
