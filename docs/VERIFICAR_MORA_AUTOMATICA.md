# Verificar que la Mora Automática Funciona

## Cambios Realizados

Se modificó el `useEffect` para que las funciones se ejecuten en secuencia:

```javascript
useEffect(() => {
  const inicializar = async () => {
    await actualizarFacturasEnMora();  // 1. Primero actualiza
    await cargarFacturas();             // 2. Luego carga
    await cargarMatriculas();           // 3. Finalmente carga matrículas
  };
  inicializar();
}, [filtroEstado]);
```

Ahora también muestra logs en la consola para que puedas verificar que se ejecuta.

---

## Cómo Verificar que Funciona

### Paso 1: Iniciar los Servidores

**Terminal 1 - Backend:**
```powershell
cd C:\Users\julia\Downloads\Nueva carpeta (2)\backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\julia\Downloads\Nueva carpeta (2)\frontend
npm run dev
```

---

### Paso 2: Abrir el Navegador con la Consola

1. Abre Chrome/Edge
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**
4. Navega a: `http://localhost:5173/facturas`

---

### Paso 3: Observar los Logs en la Consola

Deberías ver algo como:

```
✅ Facturas en mora actualizadas: {
  message: "Facturas actualizadas a estado en mora",
  facturas_actualizadas: 1,
  ids: [12]
}
```

**Si ves esto, significa que el sistema está funcionando correctamente.**

---

### Paso 4: Verificar en la Tabla

En la página de facturas, busca:

1. **Factura con matrícula M002**
2. **Estado debe ser:** `en_mora` (con color rojo oscuro)
3. **Fecha de vencimiento:** 2025-11-01

---

## Posibles Escenarios

### ✅ Escenario 1: Funciona Correctamente

**En la consola:**
```
✅ Facturas en mora actualizadas: { facturas_actualizadas: 1, ids: [12] }
```

**En la tabla:**
- Factura M002 con estado "en_mora" (rojo oscuro)

**Acción:** ¡Perfecto! El sistema está funcionando.

---

### ⚠️ Escenario 2: No Hay Facturas para Actualizar

**En la consola:**
```
✅ Facturas en mora actualizadas: {
  message: "No hay facturas vencidas para actualizar",
  facturas_actualizadas: 0
}
```

**Posibles causas:**
1. La factura ya fue actualizada anteriormente
2. No hay facturas con fecha de vencimiento anterior a hoy
3. Todas las facturas están pagadas

**Acción:** Verificar en la tabla si la factura M002 ya tiene estado "en_mora"

---

### ❌ Escenario 3: Error en la Consola

**En la consola:**
```
❌ Error al actualizar facturas en mora: [mensaje de error]
```

**Posibles causas:**
1. El backend no está corriendo
2. Error de conexión a la base de datos
3. El endpoint no existe

**Acción:** 
1. Verificar que el backend esté corriendo
2. Verificar la URL en `frontend/src/services/api.js`
3. Revisar los logs del backend

---

### 🔇 Escenario 4: No Aparece Nada en la Consola

**Posibles causas:**
1. El código no se está ejecutando
2. Hay un error que impide la ejecución
3. La consola está filtrada

**Acción:**
1. Refrescar la página (F5)
2. Verificar que no haya filtros en la consola
3. Buscar errores en la pestaña "Console"

---

## Verificación Manual Adicional

### Opción 1: Verificar en Supabase

1. Ve a tu proyecto en Supabase
2. Abre **Table Editor**
3. Selecciona la tabla `factura`
4. Busca el registro con `id = 12`
5. Verifica que `estado = 'en_mora'`

### Opción 2: Verificar con el Endpoint Directamente

Abre una nueva terminal y ejecuta:

```powershell
curl -X POST http://localhost:3001/api/facturas/actualizar-mora
```

O usa Postman/Thunder Client:
- **Method:** POST
- **URL:** `http://localhost:3001/api/facturas/actualizar-mora`

---

## Debugging

### Ver Logs del Backend

En la terminal donde corre el backend, deberías ver las peticiones:

```
POST /api/facturas/actualizar-mora 200 OK
```

### Ver Logs del Frontend

En la consola del navegador (F12), busca:

```javascript
// Éxito
✅ Facturas en mora actualizadas: {...}

// Error
❌ Error al actualizar facturas en mora: ...
```

### Ver Network Tab

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por "actualizar-mora"
4. Deberías ver una petición POST
5. Click en ella para ver:
   - **Status:** 200 OK
   - **Response:** JSON con el resultado

---

## Forzar la Actualización

Si quieres forzar la actualización sin esperar a que se ejecute automáticamente:

### Opción 1: Refrescar la Página
```
F5 o Ctrl+R
```

### Opción 2: Cambiar el Filtro
```
Cambiar el filtro de estado y volver a "Todos"
```

### Opción 3: Click en Actualizar
```
Click en el botón "🔄 Actualizar"
```

Cualquiera de estas acciones ejecutará `actualizarFacturasEnMora()` nuevamente.

---

## Resultado Esperado Final

Después de seguir estos pasos:

✅ **En la consola del navegador:**
```
✅ Facturas en mora actualizadas: { facturas_actualizadas: 1, ids: [12] }
```

✅ **En la tabla de facturas:**
- Factura ID 12 (M002) con estado "en_mora" en rojo oscuro

✅ **En Supabase:**
- Registro con id=12 tiene estado='en_mora'

✅ **Al filtrar por "En Mora":**
- Aparece la factura M002

---

## Próximos Pasos

Una vez verificado que funciona:

1. ✅ El sistema actualizará automáticamente las facturas vencidas
2. ✅ Se ejecuta cada vez que cargas la página
3. ✅ Se ejecuta cada vez que cambias el filtro
4. ✅ Se ejecuta cada vez que haces click en "Actualizar"

**El sistema está completamente funcional y automático.** 🎉

---

## Contacto

Si después de seguir todos estos pasos el sistema no funciona:

1. Captura de pantalla de la consola del navegador
2. Captura de pantalla de los logs del backend
3. Verifica que todos los archivos estén guardados
4. Reinicia ambos servidores
5. Limpia la caché del navegador (Ctrl+Shift+Delete)
