# Deploy del Backend a Render

## Problema Actual

El endpoint `/api/facturas/actualizar-mora` existe en tu código local pero no en el servidor de producción (Render), por eso obtienes error 404.

**Error:**
```
Failed to load resource: the server responded with a status of 404
acueducto-2.onrender.com/api/facturas/actualizar-mora
```

---

## Solución: Hacer Deploy

### Paso 1: Verificar que tienes Git configurado

```bash
cd C:\Users\julia\Downloads\Nueva carpeta (2)
git status
```

**Si no tienes Git inicializado:**
```bash
git init
git add .
git commit -m "Initial commit con endpoint de mora"
```

---

### Paso 2: Conectar con GitHub (si no lo has hecho)

1. **Crear repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Click en "New repository"
   - Nombre: `acueducto-sistema`
   - Click en "Create repository"

2. **Conectar tu proyecto local:**
```bash
git remote add origin https://github.com/TU_USUARIO/acueducto-sistema.git
git branch -M main
git push -u origin main
```

---

### Paso 3: Hacer Deploy desde Render

#### Opción A: Deploy Automático (Recomendado)

Si tu servicio en Render está conectado a GitHub:

1. **Hacer commit de los cambios:**
```bash
git add backend/routes/facturaRoutes.js
git commit -m "Agregar endpoint de actualización automática de mora"
git push origin main
```

2. **Render detectará los cambios automáticamente**
   - Ve a [dashboard.render.com](https://dashboard.render.com)
   - Verás que el deploy se inicia automáticamente
   - Espera 2-5 minutos

3. **Verificar el deploy:**
   - El estado debe cambiar a "Live"
   - Verás un mensaje: "Deploy succeeded"

#### Opción B: Deploy Manual

Si prefieres hacer deploy manual:

1. **Ve a Render Dashboard:**
   - [dashboard.render.com](https://dashboard.render.com)

2. **Selecciona tu servicio backend**

3. **Click en "Manual Deploy"**
   - Selecciona "Deploy latest commit"
   - O "Clear build cache & deploy" si hay problemas

4. **Espera a que termine**
   - Verás los logs en tiempo real
   - Debe terminar con "Deploy succeeded"

---

### Paso 4: Verificar que el Endpoint Funciona

Una vez que el deploy termine:

#### Prueba 1: Con cURL
```bash
curl -X POST https://acueducto-2.onrender.com/api/facturas/actualizar-mora
```

**Respuesta esperada:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 1,
  "ids": [12]
}
```

#### Prueba 2: Desde el Frontend

1. Abre tu aplicación: `https://tu-frontend.vercel.app/facturas`
2. Abre la consola (F12)
3. Deberías ver: `✅ Facturas en mora actualizadas: {...}`
4. La factura M002 debe aparecer con estado "en_mora"

---

## Troubleshooting

### Problema 1: "Deploy failed"

**Posibles causas:**
- Error de sintaxis en el código
- Dependencias faltantes
- Variables de entorno no configuradas

**Solución:**
1. Revisa los logs del deploy en Render
2. Busca el error específico
3. Corrige el error en tu código local
4. Haz commit y push nuevamente

### Problema 2: "Build succeeded but service not starting"

**Posibles causas:**
- Puerto incorrecto
- Error en la conexión a Supabase
- Variables de entorno faltantes

**Solución:**
1. Ve a "Environment" en Render
2. Verifica que tengas:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `PORT` (debe ser el que usa Render)

### Problema 3: Sigue dando 404 después del deploy

**Posibles causas:**
- El deploy no incluyó los cambios
- El archivo no se subió correctamente
- Hay un problema con las rutas

**Solución:**
1. Verifica que el commit incluya `backend/routes/facturaRoutes.js`
2. Revisa los logs del deploy
3. Verifica que el router esté exportado correctamente
4. Verifica que el router esté registrado en `server.js` o `index.js`

---

## Verificar el Código en Producción

### Opción 1: Ver los Logs de Render

1. Ve a tu servicio en Render
2. Click en "Logs"
3. Busca: `POST /api/facturas/actualizar-mora`
4. Deberías ver las peticiones cuando se ejecute

### Opción 2: Probar Todos los Endpoints

```bash
# Listar facturas
curl https://acueducto-2.onrender.com/api/facturas

# Actualizar mora
curl -X POST https://acueducto-2.onrender.com/api/facturas/actualizar-mora

# Ver factura específica
curl https://acueducto-2.onrender.com/api/facturas/12
```

---

## Checklist de Deploy

Antes de hacer deploy, verifica:

- [ ] El código compila sin errores localmente
- [ ] El endpoint funciona en local (`node test-actualizar-mora.js`)
- [ ] Todos los archivos están en Git (`git status`)
- [ ] Has hecho commit de los cambios
- [ ] Has hecho push a GitHub (si usas deploy automático)
- [ ] Las variables de entorno están configuradas en Render
- [ ] El servicio está conectado al repositorio correcto

Después del deploy, verifica:

- [ ] El deploy terminó exitosamente
- [ ] El servicio está "Live"
- [ ] El endpoint responde correctamente
- [ ] El frontend puede conectarse al endpoint
- [ ] Las facturas se actualizan automáticamente

---

## Comandos Rápidos

### Deploy Completo
```bash
# 1. Guardar cambios
git add .
git commit -m "Agregar endpoint de mora automática"

# 2. Subir a GitHub
git push origin main

# 3. Esperar deploy automático en Render (2-5 min)

# 4. Verificar
curl -X POST https://acueducto-2.onrender.com/api/facturas/actualizar-mora
```

---

## Resultado Esperado

Después del deploy exitoso:

✅ **En Render:**
- Deploy status: "Live"
- Logs muestran: "Server running on port..."

✅ **En el Frontend:**
- Consola muestra: `✅ Facturas en mora actualizadas: {...}`
- Factura M002 con estado "en_mora"

✅ **Con cURL:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 1,
  "ids": [12]
}
```

---

## Próximos Pasos

Una vez que el deploy esté completo:

1. ✅ El sistema funcionará automáticamente en producción
2. ✅ Las facturas vencidas se actualizarán al cargar la página
3. ✅ No necesitarás ejecutar scripts manualmente
4. ✅ El sistema estará completamente funcional

**¡Tu sistema de mora automática estará en producción!** 🚀
