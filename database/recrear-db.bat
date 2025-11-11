@echo off
echo ========================================
echo RECREAR BASE DE DATOS
echo ========================================
echo.
echo ADVERTENCIA: Esto eliminara todos los datos existentes!
echo.
set /p confirmar="Estas seguro? (S/N): "

if /i "%confirmar%" NEQ "S" (
    echo Operacion cancelada.
    pause
    exit /b
)

echo.
echo Eliminando base de datos anterior...
mysql -u root -p1193051330Jr -e "DROP DATABASE IF EXISTS mantenimiento_fontaneria;"

echo Creando nueva base de datos...
mysql -u root -p1193051330Jr < schema.sql

echo Insertando datos de prueba...
mysql -u root -p1193051330Jr < seed.sql

echo.
echo ========================================
echo BASE DE DATOS RECREADA EXITOSAMENTE
echo ========================================
echo.
pause
