# Orden de Rutas en Express - Problema Resuelto

## Problema Encontrado

**Error:**
```json
{
  "error": "invalid input syntax for type bigint: \"actualizar-mora\""
}
```

---

## Causa del Problema

El orden de las rutas en Express es **muy importante**. Express evalúa las rutas en el orden en que están definidas.

### Orden Incorrecto (Causaba el error):

```javascript
// ❌ INCORRECTO
router.get('/:id', async (req, res) => {
  // Esta ruta captura CUALQUIER cosa después de /facturas/
  // Incluyendo /facturas/actualizar-mora
});

router.post('/actualizar-mora', async (req, res) => {
  // Esta ruta NUNCA se alcanza porque /:id la captura primero
});
```

### ¿Qué Pasaba?

1. Cliente hace: `POST /api/facturas/actualizar-mora`
2. Express evalúa las rutas en orden
3. Encuentra `GET /:id` primero
4. Interpreta "actualizar-mora" como el parámetro `:id`
5. Intenta convertir "actualizar-mora" a número (bigint)
6. **Error:** `invalid input syntax for type bigint: "actualizar-mora"`

---

## Solución Implementada

### Orden Correcto:

```javascript
// ✅ CORRECTO

// 1. Rutas específicas primero
router.get('/', async (req, res) => {
  // GET /facturas
});

router.post('/actualizar-mora', async (req, res) => {
  // POST /facturas/actualizar-mora
  // Esta ruta específica debe estar ANTES de /:id
});

router.get('/matricula/:codigo', async (req, res) => {
  // GET /facturas/matricula/:codigo
  // Rutas con paths específicos antes de /:id
});

// 2. Rutas con parámetros dinámicos al final
router.get('/:id', async (req, res) => {
  // GET /facturas/:id
  // Esta ruta captura todo lo demás
});
```

---

## Regla General en Express

### Orden de Prioridad (de mayor a menor):

1. **Rutas exactas** (`/facturas/actualizar-mora`)
2. **Rutas con paths específicos** (`/facturas/matricula/:codigo`)
3. **Rutas con parámetros dinámicos** (`/facturas/:id`)
4. **Rutas catch-all** (`/facturas/*`)

### Ejemplo Completo:

```javascript
// ✅ Orden correcto
router.get('/facturas/estadisticas');        // 1. Más específica
router.post('/facturas/actualizar-mora');    // 2. Específica
router.get('/facturas/matricula/:codigo');   // 3. Semi-específica
router.post('/facturas/:id/pago');           // 4. Con ID específico
router.get('/facturas/:id');                 // 5. Genérica con parámetro
router.get('/facturas/*');                   // 6. Catch-all (si existe)
```

---

## Cómo Identificar Este Problema

### Síntomas:

1. **Error de tipo de datos:**
   ```
   invalid input syntax for type bigint: "nombre-de-ruta"
   ```

2. **Ruta no encontrada cuando debería existir:**
   ```
   404 Not Found
   ```

3. **Parámetro incorrecto:**
   ```
   req.params.id = "actualizar-mora" (cuando debería ser un número)
   ```

### Debugging:

```javascript
// Agregar logs para ver qué ruta se está ejecutando
router.get('/:id', async (req, res) => {
  console.log('GET /:id ejecutado con id:', req.params.id);
  // Si ves "actualizar-mora" aquí, el orden está mal
});
```

---

## Solución Aplicada en Este Proyecto

### Antes (Incorrecto):

```javascript
router.get('/', ...);
router.get('/:id', ...);                    // ❌ Captura todo
router.get('/matricula/:codigo', ...);
router.post('/', ...);
router.put('/:id/estado', ...);
router.post('/:id/pago', ...);
router.post('/actualizar-mora', ...);       // ❌ Nunca se alcanza
router.post('/generar-masivo', ...);
```

### Después (Correcto):

```javascript
router.get('/', ...);
router.post('/actualizar-mora', ...);       // ✅ Antes de /:id
router.get('/:id', ...);                    // ✅ Después de rutas específicas
router.get('/matricula/:codigo', ...);
router.post('/', ...);
router.put('/:id/estado', ...);
router.post('/:id/pago', ...);
router.post('/generar-masivo', ...);
```

---

## Verificación

### Probar que Funciona:

```bash
# Debe funcionar correctamente
curl -X POST http://localhost:3001/api/facturas/actualizar-mora

# Debe retornar JSON, no error de bigint
```

**Respuesta esperada:**
```json
{
  "message": "Facturas actualizadas a estado en mora",
  "facturas_actualizadas": 1,
  "ids": [12]
}
```

### Probar que no Rompió Otras Rutas:

```bash
# Debe seguir funcionando
curl http://localhost:3001/api/facturas/12

# Debe retornar la factura con ID 12
```

---

## Mejores Prácticas

### 1. Organizar Rutas por Especificidad

```javascript
// Grupo 1: Rutas de colección
router.get('/');
router.post('/');

// Grupo 2: Rutas de acción específicas
router.post('/actualizar-mora');
router.post('/generar-masivo');

// Grupo 3: Rutas con paths específicos
router.get('/matricula/:codigo');

// Grupo 4: Rutas de recurso individual
router.get('/:id');
router.put('/:id');
router.delete('/:id');

// Grupo 5: Rutas de sub-recursos
router.post('/:id/pago');
router.put('/:id/estado');
```

### 2. Usar Nombres Descriptivos

```javascript
// ✅ Bueno - Claro y específico
router.post('/actualizar-mora');
router.post('/generar-masivo');

// ❌ Malo - Podría confundirse con ID
router.post('/actualizar');
router.post('/generar');
```

### 3. Documentar el Orden

```javascript
// IMPORTANTE: Mantener este orden
// Las rutas específicas deben estar ANTES de /:id
router.post('/actualizar-mora', ...);
router.get('/:id', ...);
```

---

## Otros Casos Comunes

### Caso 1: Múltiples Parámetros

```javascript
// ✅ Correcto
router.get('/usuario/:userId/facturas/:facturaId');
router.get('/usuario/:userId/facturas');
router.get('/usuario/:userId');
```

### Caso 2: Métodos HTTP Diferentes

```javascript
// ✅ Correcto - Mismo path, diferentes métodos
router.get('/facturas/:id');     // Obtener
router.put('/facturas/:id');     // Actualizar
router.delete('/facturas/:id');  // Eliminar
```

### Caso 3: Query Parameters vs Path Parameters

```javascript
// ✅ Correcto
router.get('/facturas');              // GET /facturas?estado=pendiente
router.get('/facturas/:id');          // GET /facturas/12
```

---

## Resumen

**Problema:** La ruta `/actualizar-mora` estaba después de `/:id`, causando que Express la interpretara como un ID.

**Solución:** Mover `/actualizar-mora` ANTES de `/:id` en el archivo de rutas.

**Regla:** Las rutas más específicas siempre deben estar antes que las rutas con parámetros dinámicos.

**Resultado:** ✅ El endpoint ahora funciona correctamente sin errores de tipo de datos.

---

## Deploy

Después de este cambio, necesitas hacer deploy:

```bash
git add backend/routes/facturaRoutes.js
git commit -m "Fix: Corregir orden de rutas para evitar conflicto con /:id"
git push origin main
```

El sistema ahora funcionará correctamente tanto en local como en producción.
