# 🚀 Instrucciones Rápidas para Desplegar en Render

## ⚡ Solución Rápida al Error 502

El error 502 en Render se debe a que **faltan las variables de entorno**. Aquí está la solución:

## 📋 Pasos (5 minutos)

### 1. Ve a tu Servicio en Render
- Abre [dashboard.render.com](https://dashboard.render.com)
- Selecciona tu servicio backend

### 2. Configura las Variables de Entorno
- Click en **"Environment"** en el menú lateral
- Agrega estas 3 variables:

```
PORT
3001

SUPABASE_URL
https://cmqhraseujlsrzqiekke.supabase.co

SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWhyYXNldWpsc3J6cWlla2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODgyMTQsImV4cCI6MjA3NzI2NDIxNH0.QnDVsppPMFm8lms6AKPrS2AyWMZUPXudMqSQxHxOzfU
```

- Click en **"Save Changes"**

### 3. Verifica la Configuración del Servicio
En **Settings → General**, debe estar así:

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 4. Espera el Redespliegue
- Render redesplegará automáticamente
- Tarda ~2-3 minutos
- Ve a la pestaña **"Logs"** para ver el progreso

### 5. Verifica que Funcione
Deberías ver en los logs:
```
🚀 Servidor corriendo en http://localhost:3001
📊 Base de datos: Supabase (PostgreSQL)
```

Luego visita tu URL de Render:
```
https://tu-app.onrender.com
```

Deberías ver:
```json
{
  "message": "API Sistema Predial - Acueducto y Mantenimiento",
  "version": "3.0 - Supabase",
  "endpoints": { ... }
}
```

## ✅ ¡Listo!

Si ves el mensaje JSON, tu API está funcionando correctamente.

## 🔍 Si Aún No Funciona

### Revisa los Logs
1. Ve a **"Logs"** en Render
2. Busca errores en rojo
3. Si ves "SUPABASE_URL must be defined", las variables no se guardaron correctamente

### Fuerza un Redespliegue
1. Ve a **"Manual Deploy"**
2. Click en **"Clear build cache & deploy"**
3. Espera a que termine

### Verifica las Variables
1. Ve a **"Environment"**
2. Asegúrate de que las 3 variables estén ahí
3. No debe haber espacios extra en los valores

## 📱 Conectar el Frontend

Una vez que el backend funcione, actualiza la URL en tu frontend:

**Archivo:** `frontend/src/config.js`
```javascript
const API_URL = 'https://tu-backend.onrender.com/api';
export default API_URL;
```

Luego actualiza todos los componentes para importar esta configuración:
```javascript
import API_URL from '../config';

// Usar en lugar de:
// const API_URL = 'http://localhost:3001/api';
```

## 🎯 Checklist Final

- [ ] Variables de entorno configuradas en Render
- [ ] Root Directory es `backend`
- [ ] Build Command es `npm install`
- [ ] Start Command es `npm start`
- [ ] Logs muestran "Servidor corriendo"
- [ ] URL de Render responde con JSON
- [ ] Frontend actualizado con la nueva URL

## 📚 Más Información

- **Guía completa:** `DESPLIEGUE_RENDER.md`
- **Solución de problemas:** `SOLUCION_ERROR_502_RENDER.md`
- **Documentación del API:** `backend/API_DOCUMENTATION.md`

---

**¿Necesitas ayuda?** Revisa los logs en Render y compáralos con esta guía.
