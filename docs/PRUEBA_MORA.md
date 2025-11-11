# Guía de Prueba - Sistema de Mora Automática

## Problema Detectado

Tienes una factura (ID 12) con:
- **Fecha de vencimiento:** 2025-11-01
- **Fecha actual:** 2025-11-03
- **Estado:** "Pendiente" (debería ser "en_mora")

---

## Solución: Probar el Sistema

### Opción 1: Desde el Frontend

1. **Abrir la aplicación web**
   ```
   http://localhost:5173/facturas
   ```

2. **Observar el comportamiento**
   - Al cargar la página, el sistema ejecuta automáticamente `actualizarFacturasEnMora()`
   - Busca en la consola del navegador (F12) si hay algún error
   - La factura ID 12 debería cambiar a estado "en_mora" con color rojo oscuro

3. **Verificar en la tabla**
   - Buscar la factura con matrícula M002
   - Verificar que el estado sea "en_mora" (rojo oscuro)
   - Si sigue en "Pendiente", revisar la consola del navegador

---

### Opción 2: Probar el Endpoint Directamente

#### Con el Script de Prueba

```bash
cd backend
node test-actualizar-mora.js
```

**Salida esperada:**
```
🧪 Probando actualización de facturas en mora...

📅 Fecha actual: 2025-11-03

⏳ Actualizando facturas vencidas...

✅ Actualización completada!

📊 Resultado:
   - Mensaje: Facturas actualizadas a estado en mora
   - Facturas actualizadas: 1
   - IDs actualizados: 12

🔍 Verificando facturas en mora...

📄 Total de facturas en mora: 1

Facturas en mora:
   1. ID: 12 | Matrícula: M002 | Vencimiento: 2025-11-01 | Valor: $100,000

🔍 Verificando factura ID 12...

📋 Factura ID 12:
   - Matrícula: M002
   - Fecha creación: 2025-11-03
   - Fecha vencimiento: 2025-11-01
   - Valor: $100,000
   - Estado: en_mora

✅ ¡La factura 12 está correctamente en estado "en_mora"!
```

#### Con Postman/Thunder Client/cURL

**Request:**
```bash
curl -X POST http://localhost:3001/api/facturas/actualizar-mora \
  -H "Content-Type: application/json"
```

**Response esperada:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 1,
  "ids": [12]
}
```

---

### Opción 3: Verificar Directamente en la Base de Datos

Si usas Supabase:

```sql
-- Ver facturas vencidas
SELECT id, cod_matricula, fecha_vencimiento, estado, valor
FROM factura
WHERE fecha_vencimiento < CURRENT_DATE
  AND estado IN ('Pendiente', 'Vencida');

-- Actualizar manualmente (si es necesario)
UPDATE factura
SET estado = 'en_mora'
WHERE id = 12;

-- Verificar el cambio
SELECT id, cod_matricula, fecha_vencimiento, estado
FROM factura
WHERE id = 12;
```

---

## Diagnóstico de Problemas

### Problema 1: El endpoint no se ejecuta

**Síntomas:**
- La factura sigue en "Pendiente"
- No hay logs en la consola

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar la URL de la API en `frontend/src/services/api.js`
3. Revisar la consola del navegador para errores de red

### Problema 2: Error 404 en el endpoint

**Síntomas:**
- Error: "Cannot POST /api/facturas/actualizar-mora"

**Solución:**
1. Verificar que el archivo `backend/routes/facturaRoutes.js` tenga el endpoint
2. Verificar que el router esté exportado correctamente
3. Verificar que el endpoint esté registrado en `backend/server.js` o `backend/index.js`

### Problema 3: Error de conexión a la base de datos

**Síntomas:**
- Error en el servidor
- Mensaje: "Error al actualizar facturas en mora"

**Solución:**
1. Verificar credenciales de Supabase
2. Verificar que la tabla `factura` exista
3. Verificar que el campo `estado` acepte el valor 'en_mora'

### Problema 4: La fecha de vencimiento no es anterior

**Síntomas:**
- El endpoint responde: "No hay facturas vencidas para actualizar"
- La factura tiene fecha de vencimiento futura

**Solución:**
1. Verificar la fecha actual del servidor
2. Verificar la fecha de vencimiento de la factura
3. Asegurarse de que `fecha_vencimiento < fecha_actual`

---

## Verificación Manual

### Paso 1: Verificar la factura actual

```bash
curl http://localhost:3001/api/facturas/12
```

**Verificar:**
- `fecha_vencimiento`: debe ser anterior a hoy
- `estado`: debería cambiar de "Pendiente" a "en_mora"

### Paso 2: Ejecutar actualización

```bash
curl -X POST http://localhost:3001/api/facturas/actualizar-mora
```

### Paso 3: Verificar el cambio

```bash
curl http://localhost:3001/api/facturas/12
```

**Verificar:**
- `estado`: debe ser "en_mora"

### Paso 4: Verificar en el frontend

1. Abrir `http://localhost:5173/facturas`
2. Buscar la factura con matrícula M002
3. Verificar que tenga estado "en_mora" con color rojo oscuro

---

## Comandos Útiles

### Reiniciar el backend
```bash
cd backend
npm run dev
```

### Reiniciar el frontend
```bash
cd frontend
npm run dev
```

### Ver logs del backend
```bash
# En la terminal donde corre el backend
# Buscar mensajes de error o confirmación
```

### Ver logs del frontend
```bash
# Abrir consola del navegador (F12)
# Pestaña "Console"
# Buscar: "Error al actualizar facturas en mora"
```

---

## Resultado Esperado

Después de ejecutar cualquiera de las opciones anteriores:

1. ✅ La factura ID 12 debe tener estado "en_mora"
2. ✅ En el frontend, debe aparecer con color rojo oscuro
3. ✅ Al filtrar por "En Mora", debe aparecer en la lista
4. ✅ El endpoint debe retornar: `{ facturas_actualizadas: 1, ids: [12] }`

---

## Próximos Pasos

Una vez que el sistema funcione correctamente:

1. **Crear más facturas de prueba** con diferentes fechas de vencimiento
2. **Probar el filtro** "En Mora" en el frontend
3. **Verificar los colores** en la interfaz
4. **Probar el registro de pagos** para facturas en mora
5. **Verificar que el estado cambie a "Pagada"** después de pagar

---

## Contacto y Soporte

Si el problema persiste:

1. Revisar los logs del servidor
2. Verificar la configuración de Supabase
3. Verificar que todos los archivos estén guardados
4. Reiniciar ambos servidores (backend y frontend)
5. Limpiar caché del navegador

---

## Resumen

El sistema de mora automática está implementado y debería funcionar correctamente. La factura ID 12 con vencimiento 2025-11-01 debería actualizarse automáticamente a estado "en_mora" al cargar la página de facturas o al ejecutar el endpoint manualmente.

**Archivo de prueba:** `backend/test-actualizar-mora.js`
**Endpoint:** `POST /api/facturas/actualizar-mora`
**Ejecución automática:** Al cargar `/facturas` en el frontend
