# 🔧 Solución Error 502 en Render

## ❌ Problema
Error 502 (Bad Gateway) al desplegar en Render

## ✅ Soluciones Implementadas

### 1. Servidor Escucha en 0.0.0.0
**Archivo:** `backend/server.js`

```javascript
// ✅ CORRECTO - Escucha en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// ❌ INCORRECTO - Solo escucha en localhost
app.listen(PORT, () => { ... });
```

### 2. Variables de Entorno con Validación
**Archivo:** `backend/config/database.js`

Ahora muestra mensajes claros si faltan variables:
```javascript
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidos');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅ Definido' : '❌ No definido');
  console.error('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Definido' : '❌ No definido');
  throw new Error('...');
}
```

### 3. Archivos de Configuración Creados

- ✅ `render.yaml` - Configuración automática para Render
- ✅ `backend/healthcheck.js` - Script de verificación de salud
- ✅ `DESPLIEGUE_RENDER.md` - Guía completa de despliegue

## 🚀 Pasos para Resolver el Error 502

### Paso 1: Verificar Variables de Entorno en Render

1. Ve a tu servicio en Render Dashboard
2. Click en **"Environment"** en el menú lateral
3. Verifica que existan estas variables:

```
PORT=3001
SUPABASE_URL=https://cmqhraseujlsrzqiekke.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Si faltan, agrégalas y guarda
5. El servicio se redesplegará automáticamente

### Paso 2: Verificar Configuración del Servicio

En Render Dashboard, verifica:

- **Root Directory:** `backend` ✅
- **Build Command:** `npm install` ✅
- **Start Command:** `npm start` ✅
- **Runtime:** Node ✅

### Paso 3: Revisar los Logs

1. Ve a la pestaña **"Logs"** en Render
2. Busca estos mensajes:

**✅ Si todo está bien:**
```
==> Starting service with 'npm start'
🚀 Servidor corriendo en http://localhost:3001
📊 Base de datos: Supabase (PostgreSQL)
```

**❌ Si hay error:**
```
❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidos
SUPABASE_URL: ❌ No definido
```
→ Falta configurar las variables de entorno

```
Error: Cannot find module 'express'
```
→ Problema con la instalación de dependencias

```
Error: listen EADDRINUSE
```
→ Problema con el puerto (raro en Render)

### Paso 4: Forzar Redespliegue

Si los logs no muestran nada:

1. Ve a **"Manual Deploy"**
2. Click en **"Clear build cache & deploy"**
3. Espera a que termine el despliegue

### Paso 5: Probar el Endpoint

Una vez desplegado:

```bash
# Reemplaza con tu URL de Render
curl https://tu-app.onrender.com

# Deberías ver:
{
  "message": "API Sistema Predial - Acueducto y Mantenimiento",
  "version": "3.0 - Supabase",
  ...
}
```

## 🔍 Diagnóstico Rápido

### Checklist de Verificación

- [ ] ✅ Variables de entorno configuradas en Render
- [ ] ✅ `SUPABASE_URL` es correcta
- [ ] ✅ `SUPABASE_ANON_KEY` es correcta
- [ ] ✅ Root Directory es `backend`
- [ ] ✅ Build Command es `npm install`
- [ ] ✅ Start Command es `npm start`
- [ ] ✅ Los logs muestran "Servidor corriendo"
- [ ] ✅ El endpoint raíz responde

### Comandos de Prueba Local

Antes de desplegar, prueba localmente:

```bash
cd backend

# Instalar dependencias
npm install

# Verificar que las variables estén en .env
cat .env

# Probar conexión a Supabase
npm run test:db

# Iniciar servidor
npm start

# En otra terminal, probar
curl http://localhost:3001
```

## 🎯 Configuración Correcta de Render

### Opción 1: Configuración Manual

**Settings → General:**
```
Name: sistema-predial-backend
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Settings → Environment:**
```
PORT=3001
SUPABASE_URL=https://cmqhraseujlsrzqiekke.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Opción 2: Usando render.yaml

Si usas el archivo `render.yaml`:

1. Asegúrate de que esté en la raíz del proyecto
2. Las variables de entorno deben configurarse manualmente en el dashboard
3. Render detectará automáticamente la configuración

## 💡 Consejos Adicionales

### 1. Plan Free de Render
- Se duerme después de 15 minutos sin uso
- Tarda ~30 segundos en despertar
- Primera petición puede ser lenta

### 2. Mantener el Servicio Activo
Usa un servicio de ping como:
- [UptimeRobot](https://uptimerobot.com/) (gratis)
- [Cron-job.org](https://cron-job.org/) (gratis)

Configura un ping cada 10 minutos a tu URL.

### 3. Logs en Tiempo Real
```bash
# Instala Render CLI
npm install -g @render/cli

# Ver logs en tiempo real
render logs -s tu-servicio-id
```

## 🆘 Si Nada Funciona

1. **Elimina el servicio** en Render
2. **Crea uno nuevo** desde cero
3. **Sigue la guía** en `DESPLIEGUE_RENDER.md`
4. **Configura las variables** antes de desplegar
5. **Verifica los logs** durante el despliegue

## ✅ Resultado Esperado

Después de aplicar estas soluciones:

```
✅ Build: Successful
✅ Deploy: Live
✅ Health Check: Passing
✅ Status: Running
✅ URL: https://tu-app.onrender.com
```

Y al visitar la URL:
```json
{
  "message": "API Sistema Predial - Acueducto y Mantenimiento",
  "version": "3.0 - Supabase",
  "endpoints": {
    "predios": "/api/predios",
    "usuarios": "/api/usuarios",
    ...
  }
}
```

---

**¡El error 502 debería estar resuelto!** 🎉

Si sigues teniendo problemas, revisa los logs en Render y compáralos con esta guía.
