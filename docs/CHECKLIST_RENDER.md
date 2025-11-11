# ✅ Checklist de Despliegue en Render

## 🎯 Error 502 - Solución en 3 Pasos

### ✅ Paso 1: Variables de Entorno
```
□ Ir a Render Dashboard
□ Seleccionar el servicio backend
□ Click en "Environment"
□ Agregar PORT = 3001
□ Agregar SUPABASE_URL = https://cmqhraseujlsrzqiekke.supabase.co
□ Agregar SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
□ Click en "Save Changes"
```

### ✅ Paso 2: Configuración del Servicio
```
□ Ir a "Settings" → "General"
□ Verificar Root Directory = backend
□ Verificar Build Command = npm install
□ Verificar Start Command = npm start
□ Verificar Runtime = Node
```

### ✅ Paso 3: Verificar Despliegue
```
□ Ir a "Logs"
□ Buscar: "🚀 Servidor corriendo"
□ Buscar: "📊 Base de datos: Supabase"
□ Abrir la URL de Render
□ Verificar que responda con JSON
```

## 🔍 Diagnóstico Rápido

### ¿Qué ves en los Logs?

#### ✅ CORRECTO:
```
==> Starting service with 'npm start'
🚀 Servidor corriendo en http://localhost:3001
📊 Base de datos: Supabase (PostgreSQL)
📝 Documentación disponible en http://localhost:3001
🌍 Entorno: production
```
**→ ¡Todo bien! Tu API está funcionando.**

#### ❌ ERROR: Variables no definidas
```
❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY deben estar definidos
SUPABASE_URL: ❌ No definido
SUPABASE_ANON_KEY: ❌ No definido
```
**→ Solución:** Agrega las variables de entorno en Render (Paso 1)

#### ❌ ERROR: Cannot find module
```
Error: Cannot find module 'express'
Error: Cannot find module '@supabase/supabase-js'
```
**→ Solución:** 
- Verifica que Root Directory sea `backend`
- Fuerza redespliegue con "Clear build cache & deploy"

#### ❌ ERROR: EADDRINUSE
```
Error: listen EADDRINUSE: address already in use
```
**→ Solución:** Raro en Render, pero intenta:
- Forzar redespliegue
- Verificar que no haya otro servicio en el mismo puerto

## 🧪 Pruebas

### Prueba 1: Endpoint Raíz
```bash
curl https://tu-app.onrender.com
```
**Esperado:**
```json
{
  "message": "API Sistema Predial - Acueducto y Mantenimiento",
  "version": "3.0 - Supabase",
  "endpoints": { ... }
}
```

### Prueba 2: Endpoint de Predios
```bash
curl https://tu-app.onrender.com/api/predios
```
**Esperado:**
```json
[
  {
    "id": 1,
    "direccion": "Calle 12 #4-56",
    "propietario": { ... }
  }
]
```

### Prueba 3: Endpoint de Usuarios
```bash
curl https://tu-app.onrender.com/api/usuarios
```
**Esperado:**
```json
[
  {
    "cc": "1001",
    "nombre": "Laura",
    "apellido": "Jiménez"
  }
]
```

## 📊 Estado del Servicio

### ✅ Todo Correcto
```
Status: ● Running
Health Check: ✓ Passing
Last Deploy: ✓ Successful
Build: ✓ Successful
```

### ⚠️ Problemas
```
Status: ● Starting (más de 5 minutos)
→ Revisa los logs

Status: ● Build Failed
→ Verifica Root Directory y Build Command

Status: ● Deploy Failed
→ Revisa las variables de entorno
```

## 🎯 Resultado Final

Cuando todo funcione correctamente:

```
✅ Variables de entorno configuradas
✅ Servicio desplegado exitosamente
✅ Logs muestran "Servidor corriendo"
✅ URL responde con JSON
✅ Endpoints del API funcionan
✅ Sin errores 502
```

## 🚀 Siguiente Paso: Frontend

Una vez que el backend funcione:

1. Copia tu URL de Render: `https://tu-app.onrender.com`
2. Actualiza `frontend/src/config.js`:
   ```javascript
   const API_URL = 'https://tu-app.onrender.com/api';
   ```
3. Despliega el frontend en Vercel/Netlify
4. ¡Listo!

## 📞 ¿Necesitas Ayuda?

Si marcaste todos los checkboxes pero aún tienes problemas:

1. **Captura de pantalla** de los logs
2. **Captura de pantalla** de las variables de entorno
3. **Captura de pantalla** de la configuración del servicio
4. Revisa `SOLUCION_ERROR_502_RENDER.md` para más detalles

---

**Tiempo estimado:** 5-10 minutos
**Dificultad:** Fácil
**Requisitos:** Cuenta en Render + Proyecto en Supabase
