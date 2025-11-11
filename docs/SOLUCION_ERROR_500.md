# Solución al Error 500 en Solicitudes y Reportes

## Problema
El backend está devolviendo error 500 porque la base de datos tiene datos con la estructura antigua (antes de la actualización).

## Solución: Recrear la Base de Datos

### Opción 1: Usando el script automático (RECOMENDADO)

1. Abre una terminal en la carpeta `database`
2. Ejecuta:
```bash
recrear-db.bat
```
3. Confirma con "S" cuando te lo pida
4. Espera a que termine

### Opción 2: Manual con MySQL Workbench

1. Abre MySQL Workbench
2. Ejecuta estos comandos en orden:

```sql
-- 1. Eliminar base de datos anterior
DROP DATABASE IF EXISTS mantenimiento_fontaneria;

-- 2. Crear nueva base de datos
SOURCE C:/Users/julia/Downloads/Nueva carpeta (2)/database/schema.sql;

-- 3. Insertar datos de prueba
SOURCE C:/Users/julia/Downloads/Nueva carpeta (2)/database/seed.sql;
```

### Opción 3: Desde línea de comandos

```bash
cd database

# Eliminar base de datos anterior
mysql -u root -p1193051330Jr -e "DROP DATABASE IF EXISTS mantenimiento_fontaneria;"

# Crear nueva estructura
mysql -u root -p1193051330Jr < schema.sql

# Insertar datos
mysql -u root -p1193051330Jr < seed.sql
```

## Verificar que Funcionó

1. Ejecuta el test de conexión:
```bash
cd backend
npm run test:db
```

Deberías ver:
```
✅ Conexión exitosa!
📋 Tablas disponibles:
  - predio
  - usuario
  - matricula
  - solicitud_mantenimiento
  - reporte_mantenimiento
  - factura
  ...

📊 Estadísticas:
  Usuarios: 6
  Matrículas: 5
  Facturas: 5
```

2. Reinicia el servidor backend:
```bash
cd backend
npm run dev
```

3. Prueba los endpoints:
```bash
# Solicitudes
curl http://localhost:3001/api/solicitudes

# Reportes
curl http://localhost:3001/api/reportes

# Matrículas
curl http://localhost:3001/api/matriculas
```

## ¿Por qué pasó esto?

La base de datos tenía la estructura antigua donde:
- `predio` tenía una columna `matricula` (VARCHAR)
- No existía la tabla `matricula` separada
- Las solicitudes referenciaban directamente a `predio.matricula`

Ahora la estructura es:
- `predio` tiene `id_predio` (INT)
- Existe tabla `matricula` que relaciona usuarios con predios
- Las solicitudes referencian a `matricula.numero_matricula`

## Datos de Prueba Incluidos

Después de recrear la base de datos tendrás:

- **6 usuarios**: propietarios, encargados y fontaneros
- **5 predios**: casas, apartamentos, lotes
- **5 matrículas activas**: relacionando usuarios con predios
- **3 solicitudes de mantenimiento**: con diferentes prioridades
- **5 facturas**: algunas pagadas, otras pendientes
- **1 configuración del acueducto**: con tarifas y parámetros

## Si Aún Tienes Problemas

1. Verifica que MySQL esté corriendo
2. Verifica las credenciales en `backend/.env`
3. Revisa los logs del servidor backend en la terminal
4. Ejecuta `backend/test-solicitudes.js` para diagnóstico detallado
