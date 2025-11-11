@echo off
echo ========================================
echo Configuracion de Base de Datos
echo ========================================
echo.
echo Por favor ingresa la ruta completa de mysql.exe
echo Ejemplo: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
echo.
set /p MYSQL_PATH="Ruta de mysql.exe: "
echo.
echo Ingresa tu password de MySQL cuando se solicite
echo.
echo Creando base de datos y tablas...
"%MYSQL_PATH%" -u root -p < schema.sql
echo.
echo Insertando datos de prueba...
"%MYSQL_PATH%" -u root -p < seed.sql
echo.
echo ========================================
echo Configuracion completada!
echo ========================================
pause
