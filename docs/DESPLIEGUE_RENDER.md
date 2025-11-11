# 🚀 Guía de Despliegue en Render

## Problema Común: Error 502

El error 502 en Render generalmente ocurre por:
1. ❌ Variables de entorno no configuradas
2. ❌ El servidor no escucha en `0.0.0.0`
3. ❌ Puerto incorrecto
4. ❌ Error en el código que impide el inicio

## ✅ Solución Implementada

### 1. Servidor Configurado Correctamente
El servidor ahora escucha en `0.0.0.0` (todas las interfaces):
```javascript
app.listen(PORT, '0.0.0.0', () => { ... });
```

### 2. Mejor Manejo de Errores
La configuración de Supabase ahora muestra mensajes claros si faltan variables.

## 📝 Pasos para Desplegar en Render

### Opción A: Despliegue Manual (Recomendado)

#### 1. Crear Web Service en Render

1. Ve a [https://dashboard.render.com](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub/GitLab
4. Configura:
   - **Name:** `sistema-predial-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main` (o tu rama principal)
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

#### 2. Configurar Variables de Entorno

En la sección **Environment**, agrega:

```
PORT=3001
SUPABASE_URL=https://cmqhraseujlsrzqiekke.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWhyYXNldWpsc3J6cWlla2tlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODgyMTQsImV4cCI6MjA3NzI2NDIxNH0.QnDVsppPMFm8lms6AKPrS2AyWMZUPXudMqSQxHxOzfU
```

⚠️ **Importante:** Usa tus propias credenciales de Supabase.

#### 3. Desplegar

Click en **"Create Web Service"** y espera a que se despliegue.

### Opción B: Usando render.yaml (Automático)

Si tienes el archivo `render.yaml` en la raíz del proyecto:

1. Ve a Render Dashboard
2. Click en **"New +"** → **"Blueprint"**
3. Conecta tu repositorio
4. Render detectará automáticamente el `render.yaml`
5. **Importante:** Configura las variables de entorno manualmente en el dashboard

## 🔍 Verificar el Despliegue

### 1. Ver Logs en Tiempo Real

En el dashboard de Render, ve a la pestaña **"Logs"** y busca:

```
✅ Debe aparecer:
🚀 Servidor corriendo en http://localhost:3001
📊 Base de datos: Supabase (PostgreSQL)
📝 Documentación disponible en http://localhost:3001

❌ Si ves esto, faltan variables:
❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidos
```

### 2. Probar el Endpoint

Una vez desplegado, tu URL será algo como:
```
https://sistema-predial-backend.onrender.com
```

Prueba:
```bash
curl https://tu-app.onrender.com
```

Deberías ver:
```json
{
  "message": "API Sistema Predial - Acueducto y Mantenimiento",
  "version": "3.0 - Supabase",
  "endpoints": { ... }
}
```

### 3. Probar un Endpoint Específico

```bash
curl https://tu-app.onrender.com/api/predios
```

## 🐛 Solución de Problemas

### Error 502: Bad Gateway

**Causa:** El servidor no está iniciando correctamente.

**Solución:**
1. Verifica los logs en Render
2. Asegúrate de que las variables de entorno estén configuradas
3. Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctas

### Error: "Cannot find module"

**Causa:** Dependencias no instaladas.

**Solución:**
1. Verifica que `package.json` esté en la carpeta `backend`
2. Asegúrate de que el **Root Directory** sea `backend`
3. El **Build Command** debe ser `npm install`

### Error: "EADDRINUSE"

**Causa:** El puerto ya está en uso.

**Solución:**
- Render asigna automáticamente el puerto
- Asegúrate de usar `process.env.PORT || 3001`

### Error: "SUPABASE_URL must be defined"

**Causa:** Variables de entorno no configuradas.

**Solución:**
1. Ve a tu servicio en Render
2. Click en **"Environment"**
3. Agrega `SUPABASE_URL` y `SUPABASE_ANON_KEY`
4. Click en **"Save Changes"**
5. El servicio se redesplegará automáticamente

### El servidor inicia pero no responde

**Causa:** No está escuchando en `0.0.0.0`.

**Solución:**
- Ya está corregido en `server.js`:
```javascript
app.listen(PORT, '0.0.0.0', () => { ... });
```

## 📊 Configuración Recomendada para Render

### Free Plan
- ✅ Suficiente para desarrollo y pruebas
- ⚠️ Se duerme después de 15 minutos de inactividad
- ⚠️ Tarda ~30 segundos en despertar

### Starter Plan ($7/mes)
- ✅ Siempre activo
- ✅ Mejor rendimiento
- ✅ Sin tiempo de espera

## 🔐 Seguridad

### Variables de Entorno
- ✅ Nunca subas `.env` a GitHub
- ✅ Usa las variables de entorno de Render
- ✅ Mantén `SUPABASE_ANON_KEY` privada

### CORS
Para producción, actualiza el CORS en `server.js`:

```javascript
app.use(cors({
  origin: ['https://tu-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

## 🌐 Conectar Frontend

Una vez desplegado el backend, actualiza la URL del API en tu frontend:

```javascript
// frontend/src/config.js
const API_URL = import.meta.env.PROD 
  ? 'https://tu-backend.onrender.com/api'
  : 'http://localhost:3001/api';

export default API_URL;
```

Luego actualiza todos los componentes para usar esta configuración.

## ✅ Checklist de Despliegue

- [ ] Repositorio en GitHub/GitLab
- [ ] Archivo `package.json` en carpeta `backend`
- [ ] Variables de entorno configuradas en Render
- [ ] Root Directory configurado como `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Servidor escucha en `0.0.0.0`
- [ ] Logs muestran "Servidor corriendo"
- [ ] Endpoint raíz responde correctamente
- [ ] Endpoints del API funcionan

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs** en Render Dashboard
2. **Verifica las variables** de entorno
3. **Prueba localmente** con `npm start`
4. **Compara** con la configuración de este documento

## 🎯 Resultado Esperado

Después de seguir estos pasos, deberías ver:

```
✅ Build successful
✅ Deploy live
✅ Health checks passing
✅ API respondiendo en https://tu-app.onrender.com
```

---

**Última actualización:** Configuración optimizada para Render con Supabase
