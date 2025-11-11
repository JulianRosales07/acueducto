# Cambios en la Interfaz de Facturas

## Resumen de Cambios

Se agregó la funcionalidad de **crear facturas individuales** además de la generación masiva existente.

---

## Antes

### Botón único:
```
┌─────────────────────────────────────────┐
│  ⚡ Generar Facturas Masivo             │
└─────────────────────────────────────────┘
```

**Funcionalidad:** Solo permitía generar facturas para todas las matrículas activas.

---

## Después

### Dos botones:
```
┌──────────────────────┐  ┌──────────────────────┐
│  + Nueva Factura     │  │  ⚡ Generar Masivo    │
└──────────────────────┘  └──────────────────────┘
     (Azul)                    (Verde)
```

**Funcionalidades:**

1. **+ Nueva Factura (Azul):** Crea una factura individual para una matrícula específica
2. **⚡ Generar Masivo (Verde):** Genera facturas para todas las matrículas activas

---

## Modal: Nueva Factura

### Campos del formulario:

```
┌─────────────────────────────────────────┐
│  Nueva Factura                          │
├─────────────────────────────────────────┤
│                                         │
│  Matrícula *                            │
│  [Selector desplegable]                 │
│  M001 - Calle 12 #4-56                  │
│                                         │
│  Fecha de Vencimiento *                 │
│  [2025-12-15]                           │
│                                         │
│  Valor *                                │
│  [50000]                                │
│                                         │
│  URL del PDF (Opcional)                 │
│  [facturas/factura_001.pdf]             │
│  Si se deja vacío, se generará          │
│  automáticamente                        │
│                                         │
│  [Cancelar]  [Crear Factura]            │
└─────────────────────────────────────────┘
```

### Características:

✅ **Selector de Matrícula:** Muestra código y dirección del predio
✅ **Validación:** Campos requeridos marcados con *
✅ **Auto-generación:** URL del PDF se genera automáticamente si no se proporciona
✅ **Feedback:** Mensajes de éxito/error al guardar

---

## Flujo de Uso

### Crear Factura Individual:

1. Usuario hace click en **"+ Nueva Factura"**
2. Se abre modal con formulario
3. Selecciona matrícula del desplegable
4. Ingresa fecha de vencimiento
5. Ingresa valor
6. (Opcional) Ingresa URL del PDF
7. Click en **"Crear Factura"**
8. Sistema valida y guarda
9. Muestra mensaje de confirmación
10. Cierra modal y actualiza tabla

### Generar Facturas Masivo:

1. Usuario hace click en **"⚡ Generar Masivo"**
2. Se abre modal con formulario
3. Ingresa periodo de facturación
4. Ingresa valor base
5. Ingresa días de vencimiento
6. Click en **"Generar Facturas"**
7. Confirma en diálogo
8. Sistema procesa todas las matrículas
9. Muestra resumen de resultados
10. Actualiza tabla con nuevas facturas

---

## Diferencias Clave

| Característica | Nueva Factura | Generar Masivo |
|----------------|---------------|----------------|
| **Alcance** | Una matrícula | Todas las matrículas activas |
| **Selector de matrícula** | ✅ Sí | ❌ No (automático) |
| **Detección de mora** | ❌ No | ✅ Sí |
| **Periodo** | ❌ No requerido | ✅ Requerido |
| **Validación duplicados** | ❌ No | ✅ Sí |
| **Reporte de errores** | Simple | Detallado |
| **Uso típico** | Facturas especiales | Facturación mensual |

---

## Código Modificado

### Archivos actualizados:

1. **frontend/src/pages/FacturasPage.jsx**
   - Agregado estado `mostrarModalNueva`
   - Agregado estado `formNueva`
   - Agregado estado `guardando`
   - Agregado estado `matriculas`
   - Agregada función `cargarMatriculas()`
   - Agregada función `crearNuevaFactura()`
   - Agregado botón "Nueva Factura"
   - Agregado modal de nueva factura

2. **docs/FACTURACION_MASIVA.md**
   - Actualizada sección de características del frontend

3. **docs/GUIA_FACTURACION.md**
   - Agregada sección "Crear Nueva Factura Individual"
   - Agregado caso de uso para factura individual
   - Renumerados casos de uso existentes

---

## Beneficios

✅ **Flexibilidad:** Permite crear facturas individuales sin afectar a todos los usuarios
✅ **Casos especiales:** Útil para servicios adicionales, ajustes, o facturas fuera del ciclo normal
✅ **Control:** El administrador tiene control total sobre cada factura individual
✅ **Simplicidad:** Interfaz intuitiva con selector de matrícula
✅ **Validación:** Previene errores con validaciones en tiempo real

---

## Próximos Pasos Sugeridos

- [ ] Agregar búsqueda en el selector de matrículas
- [ ] Permitir editar facturas existentes
- [ ] Agregar campo de observaciones en nueva factura
- [ ] Implementar cálculo automático de mora en facturas individuales
- [ ] Agregar vista previa del PDF antes de guardar
- [ ] Permitir adjuntar archivos PDF directamente
