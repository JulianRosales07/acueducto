# Instrucciones para Configurar la Base de Datos

## Opción 1: Usando MySQL Workbench (Recomendado)

1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL local
3. Abre el archivo `schema.sql`:
   - File → Open SQL Script
   - Selecciona `database/schema.sql`
   - Click en el icono de rayo (Execute) o presiona Ctrl+Shift+Enter
4. Abre el archivo `seed.sql`:
   - File → Open SQL Script
   - Selecciona `database/seed.sql`
   - Click en el icono de rayo (Execute)

## Opción 2: Usando la línea de comandos

### Encuentra la ruta de MySQL

MySQL generalmente se instala en:
- `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
- `C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe`
- `C:\xampp\mysql\bin\mysql.exe` (si usas XAMPP)

### Ejecuta los scripts

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database\schema.sql
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database\seed.sql
```

(Reemplaza la ruta con la ubicación real de tu instalación de MySQL)

## Opción 3: Copiar y pegar manualmente

1. Abre MySQL Workbench o cualquier cliente MySQL
2. Copia todo el contenido de `schema.sql`
3. Pégalo en una nueva query y ejecútalo
4. Copia todo el contenido de `seed.sql`
5. Pégalo en una nueva query y ejecútalo

## Verificar la instalación

Ejecuta esta query en MySQL:

```sql
USE mantenimiento_fontaneria;
SHOW TABLES;
SELECT * FROM tipo_mantenimiento;
```

Deberías ver 5 tablas y 6 tipos de mantenimiento.

## Datos de prueba incluidos

El archivo `seed.sql` incluye:
- 6 tipos de mantenimiento
- 4 usuarios (propietarios, encargados y fontaneros)
- 3 predios de ejemplo
- 3 solicitudes de ejemplo

## Credenciales por defecto

Usuario: root
Password: (tu password de MySQL)
Base de datos: mantenimiento_fontaneria
Puerto: 3306
