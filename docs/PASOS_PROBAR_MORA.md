# Pasos para Probar el Sistema de Mora

## ⚠️ Error que obtuviste:
```
❌ Error durante la prueba: fetch failed
```

**Causa:** El servidor backend no está corriendo.

---

## ✅ Solución: Sigue estos pasos

### Paso 1: Abrir DOS terminales

Necesitas tener el servidor corriendo en una terminal y ejecutar el script en otra.

---

### Paso 2: Terminal 1 - Iniciar el Backend

```powershell
# En la primera terminal
cd C:\Users\julia\Downloads\Nueva carpeta (2)\backend
npm run dev
```

**Espera a ver algo como:**
```
Server running on port 3001
Connected to Supabase
```

**⚠️ NO CIERRES ESTA TERMINAL** - Déjala corriendo

---

### Paso 3: Terminal 2 - Ejecutar el Script de Prueba

```powershell
# Abre una SEGUNDA terminal (nueva ventana)
cd C:\Users\julia\Downloads\Nueva carpeta (2)\backend
node test-actualizar-mora.js
```

**Ahora deberías ver:**
```
🧪 Probando actualización de facturas en mora...

📅 Fecha actual: 2025-11-03
🌐 URL del servidor: http://localhost:3001/api

⏳ Actualizando facturas vencidas...

✅ Actualización completada!

📊 Resultado:
   - Mensaje: Facturas actualizadas a estado en mora
   - Facturas actualizadas: 1
   - IDs actualizados: 12
```

---

## Alternativa: Probar desde el Frontend

Si no quieres usar el script, simplemente:

### Paso 1: Iniciar el Backend
```powershell
cd C:\Users\julia\Downloads\Nueva carpeta (2)\backend
npm run dev
```

### Paso 2: Iniciar el Frontend (en otra terminal)
```powershell
cd C:\Users\julia\Downloads\Nueva carpeta (2)\frontend
npm run dev
```

### Paso 3: Abrir el Navegador
```
http://localhost:5173/facturas
```

**El sistema actualizará automáticamente las facturas en mora al cargar la página.**

---

## Verificar que Funcionó

### En el Frontend:
1. Busca la factura con matrícula **M002**
2. Debería tener estado **"en_mora"** con color **rojo oscuro**
3. Si filtras por "En Mora", debería aparecer

### En la Base de Datos (Supabase):
1. Ve a tu proyecto en Supabase
2. Abre el Table Editor
3. Selecciona la tabla `factura`
4. Busca la fila con `id = 12`
5. El campo `estado` debería ser `en_mora`

---

## Comandos Resumidos

### Opción 1: Con Script de Prueba
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2 (nueva ventana)
cd backend
node test-actualizar-mora.js
```

### Opción 2: Con Frontend
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2 (nueva ventana)
cd frontend
npm run dev

# Navegador
http://localhost:5173/facturas
```

---

## Troubleshooting

### Problema: "npm run dev" no funciona

**Solución:**
```powershell
cd backend
npm install
npm run dev
```

### Problema: Puerto 3001 ya está en uso

**Solución:**
```powershell
# Matar el proceso en el puerto 3001
netstat -ano | findstr :3001
taskkill /PID [número_del_proceso] /F

# O cambiar el puerto en backend/server.js o backend/index.js
```

### Problema: Error de conexión a Supabase

**Solución:**
1. Verifica las credenciales en `backend/.env` o `backend/config/database.js`
2. Asegúrate de que tu proyecto de Supabase esté activo
3. Verifica que la URL y la API Key sean correctas

---

## Resultado Esperado

Después de seguir estos pasos, deberías ver:

✅ **En el script:**
```
Facturas actualizadas: 1
IDs actualizados: 12
```

✅ **En el frontend:**
- Factura M002 con estado "en_mora" (rojo oscuro)

✅ **En la base de datos:**
- Registro con id=12 tiene estado='en_mora'

---

## Próximo Paso

Una vez que funcione, el sistema actualizará automáticamente las facturas vencidas cada vez que:
- Cargues la página de facturas
- Cambies el filtro de estado
- Hagas click en "Actualizar"

**¡El sistema está listo para usar!** 🎉
