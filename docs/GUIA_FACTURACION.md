# Guía de Uso - Módulo de Facturación

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Módulo](#acceso-al-módulo)
3. [Generar Facturas Masivamente](#generar-facturas-masivamente)
4. [Gestionar Facturas](#gestionar-facturas)
5. [Casos de Uso](#casos-de-uso)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

## Introducción

El módulo de facturación permite al administrador generar facturas automáticamente para todas las matrículas activas del sistema, con detección y cálculo automático de mora para facturas vencidas.

### Características principales:

- ✅ Generación masiva de facturas
- ✅ Detección automática de facturas en mora
- ✅ Cálculo automático de intereses moratorios (3% mensual)
- ✅ Prevención de duplicados por periodo
- ✅ Filtrado por estado
- ✅ Actualización de estados
- ✅ Reporte de resultados detallado

## Acceso al Módulo

1. Inicia sesión como **Administrador**
2. En el menú lateral, selecciona **"Facturas"**
3. Verás la pantalla de gestión de facturas

## Crear Nueva Factura Individual

### Paso 1: Abrir el formulario

Click en el botón **"+ Nueva Factura"** en la esquina superior derecha.

### Paso 2: Completar el formulario

El formulario requiere los siguientes campos:

#### 1. Matrícula (Requerido)
- **Tipo:** Selector desplegable
- **Descripción:** Selecciona la matrícula para la cual crear la factura
- **Nota:** Muestra el código de matrícula y la dirección del predio

#### 2. Fecha de Vencimiento (Requerido)
- **Tipo:** Fecha
- **Descripción:** Fecha límite para el pago de la factura

#### 3. Valor (Requerido)
- **Tipo:** Número
- **Ejemplo:** `50000`
- **Descripción:** Monto total de la factura

#### 4. URL del PDF (Opcional)
- **Tipo:** Texto
- **Ejemplo:** `facturas/factura_001.pdf`
- **Descripción:** Ruta del archivo PDF de la factura
- **Nota:** Si se deja vacío, se genera automáticamente

### Paso 3: Guardar

1. Revisa los datos ingresados
2. Click en **"Crear Factura"**
3. Espera la confirmación
4. La nueva factura aparecerá en la tabla

## Generar Facturas Masivamente

### Paso 1: Abrir el formulario

Click en el botón **"⚡ Generar Facturas Masivo"** en la esquina superior derecha.

### Paso 2: Completar el formulario

El formulario requiere 3 campos:

#### 1. Periodo de Facturación (Requerido)
- **Formato sugerido:** `YYYY-MM` (ej: `2025-11`)
- **Alternativa:** Texto descriptivo (ej: `Noviembre 2025`)
- **Uso:** Identifica el periodo de facturación y previene duplicados

#### 2. Valor Base (Requerido)
- **Tipo:** Número
- **Ejemplo:** `50000`
- **Descripción:** Valor de la factura sin incluir mora
- **Nota:** Este valor se aplicará a todas las matrículas

#### 3. Días de Vencimiento
- **Tipo:** Número
- **Valor por defecto:** `15`
- **Rango:** 1 - 90 días
- **Descripción:** Días desde la emisión hasta el vencimiento

### Paso 3: Confirmar generación

1. Revisa los datos ingresados
2. Click en **"Generar Facturas"**
3. Confirma en el diálogo que aparece
4. Espera a que el proceso termine

### Paso 4: Revisar resultados

El sistema mostrará un banner con:
- ✅ Número de facturas creadas exitosamente
- ❌ Número de errores
- 📋 Detalle de errores (expandible)

## Gestionar Facturas

### Ver todas las facturas

La tabla principal muestra:
- **ID:** Identificador único de la factura
- **Matrícula:** Código de la matrícula asociada
- **Periodo:** Periodo de facturación
- **Fecha Emisión:** Fecha de creación
- **Vencimiento:** Fecha límite de pago
- **Valor:** Monto total (incluye mora si aplica)
- **Estado:** Pendiente, Pagada, Vencida, en_mora
- **Acciones:** Botones de acción

### Filtrar facturas

Usa el selector **"Filtrar por estado"** para ver:
- Todas las facturas
- Solo pendientes
- Solo pagadas
- Solo vencidas
- Solo en mora

### Marcar como pagada

1. Localiza la factura en estado "Pendiente"
2. Click en el botón **✓** (check verde)
3. Confirma la acción
4. El estado cambiará a "Pagada"

### Ver PDF

Si la factura tiene un PDF asociado:
1. Click en el icono **📄**
2. Se abrirá en una nueva pestaña

### Actualizar lista

Click en **"🔄 Actualizar"** para recargar los datos.

## Casos de Uso

### Caso 1: Crear factura para un usuario específico

**Escenario:** Un usuario solicita una factura individual por un servicio especial.

**Pasos:**
1. Click en "+ Nueva Factura"
2. Seleccionar matrícula del usuario
3. Fecha vencimiento: `2025-12-15`
4. Valor: `75000`
5. URL PDF: (dejar vacío para auto-generar)
6. Click en "Crear Factura"

**Resultado:** Se crea una factura individual para esa matrícula específica.

### Caso 2: Facturación mensual normal

**Escenario:** Es inicio de mes y necesitas facturar a todos los usuarios.

**Pasos:**
1. Click en "⚡ Generar Masivo"
2. Periodo: `2025-11`
3. Valor base: `50000`
4. Días vencimiento: `15`
5. Generar

**Resultado:** Se crean facturas para todas las matrículas activas con vencimiento a 15 días.

### Caso 3: Usuario con facturas vencidas

**Escenario:** Un usuario tiene 2 facturas vencidas de $50,000 cada una, vencidas hace 2 meses.

**Proceso automático:**
1. Sistema detecta las 2 facturas vencidas
2. Calcula mora: $50,000 × 0.03 × 2 = $3,000 por factura
3. Mora total: $6,000
4. Nueva factura: $50,000 (base) + $6,000 (mora) = $56,000
5. Actualiza facturas anteriores a estado "Vencida"
6. Registra observaciones con detalle de mora

**Resultado:** El usuario recibe una factura de $56,000 que incluye el valor del periodo actual más la mora acumulada.

### Caso 4: Prevención de duplicados

**Escenario:** Intentas generar facturas para un periodo que ya fue facturado.

**Resultado:** 
- Las matrículas ya facturadas aparecen en "Errores"
- Mensaje: "Ya existe factura para este periodo"
- Solo se crean facturas para matrículas sin factura en ese periodo

### Caso 5: Sin matrículas activas

**Escenario:** No hay matrículas con estado "Activa".

**Resultado:**
- Error: "No hay matrículas activas para facturar"
- No se crea ninguna factura

## Preguntas Frecuentes

### ¿Cómo se calcula la mora?

**Fórmula:** `mora = valor_factura × 0.03 × meses_vencidos`

**Ejemplo:**
- Factura de $50,000 vencida hace 3 meses
- Mora = $50,000 × 0.03 × 3 = $4,500

### ¿Qué pasa si genero facturas dos veces para el mismo periodo?

El sistema previene duplicados. Las matrículas que ya tienen factura para ese periodo aparecerán en la lista de errores.

### ¿Puedo cambiar el porcentaje de mora?

Actualmente está fijo en 3% mensual. En futuras versiones se podrá configurar desde la base de datos.

### ¿Qué estados puede tener una factura?

- **Pendiente:** Emitida, no vencida, sin pagar
- **Pagada:** Pagada completamente
- **Vencida:** Superó fecha de vencimiento sin pagar
- **en_mora:** Vencida con mora acumulada

### ¿Cómo se actualiza el estado automáticamente?

- Al generar facturas nuevas, las vencidas se actualizan a "Vencida"
- Al registrar un pago completo, cambia a "Pagada"
- El estado "en_mora" se asigna cuando se detecta mora al generar nueva factura

### ¿Puedo facturar solo algunas matrículas?

Actualmente la generación es masiva para todas las matrículas activas. Para facturar individualmente, usa el endpoint POST /facturas con los datos específicos.

### ¿Qué pasa si hay un error en una matrícula?

El proceso continúa con las demás. Los errores se reportan al final sin detener la generación completa.

### ¿Cómo genero el PDF de la factura?

El sistema guarda la URL del PDF en el campo `url`. La generación del PDF debe implementarse por separado (puede ser con una librería como PDFKit o similar).

### ¿Puedo editar una factura después de crearla?

Actualmente solo se puede cambiar el estado. Para modificar valores, deberías actualizar directamente en la base de datos o implementar un endpoint de edición.

### ¿Cómo registro un pago?

Usa el endpoint POST /facturas/:id/pago o implementa un botón en la interfaz que llame a este endpoint con los datos del pago.

## Soporte Técnico

Para problemas técnicos o dudas adicionales:
- Revisa los logs del servidor
- Consulta la documentación de la API
- Verifica la conexión a la base de datos
- Revisa el archivo `docs/FACTURACION_MASIVA.md` para detalles técnicos

## Próximas Mejoras

- [ ] Generación automática de PDF
- [ ] Envío de facturas por email
- [ ] Configuración de porcentaje de mora
- [ ] Facturación programada automática
- [ ] Reportes y estadísticas
- [ ] Exportación a Excel
- [ ] Historial de cambios de estado
