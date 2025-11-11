# Funcionalidad de Facturación Masiva

## Descripción General

Sistema de generación masiva de facturas para todas las matrículas activas, con detección automática de facturas en mora y cálculo de intereses moratorios.

## Historia de Usuario

**Nombre:** Facturar para todos los usuarios

**Actor:** Administrador del Sistema

**Descripción:** Como administrador del sistema quiero generar facturas para todas las matrículas y los cargos por mora, para poder mantener al día los cobros y reflejar bien las deudas de cada usuario.

## Criterios de Aceptación

### 1. Generación de Facturas Nuevas
**Condición:** Cuando el sistema ejecuta el proceso de facturar

**Resultado:** El sistema genera facturas nuevas para todas las matrículas activas en la BD

### 2. Detección de Mora
**Condición:** Cuando se detectan facturas anteriores con estado de en mora

**Resultado:** El sistema suma los pagos pendientes y el valor de la mora al total a pagar de la factura actual

### 3. Almacenamiento de Factura
**Condición:** Cuando la factura se haya generado correctamente

**Resultado:** Se almacena en la base de datos:
- Código de Factura
- idFactura
- Fecha de emisión
- Fecha de vencimiento
- valorTotal
- consumo_m3
- valordeConsumo
- Estado de la factura
- URL del PDF

### 4. Validación de Matrículas
**Condición:** Cuando no existan matrículas registradas o activas

**Resultado:** El sistema muestra un mensaje informando que no hay usuarios disponibles para facturar

### 5. Manejo de Errores
**Condición:** Cuando ocurra un error durante la generación

**Resultado:** El sistema muestra una alerta al usuario administrador y registra el error

## Funcionalidades Implementadas

### Backend (facturaRoutes.js)

#### Endpoint: POST /api/facturas/generar-masivo

**Parámetros:**
```json
{
  "periodo_facturacion": "2025-01",
  "valor_base": 50000,
  "dias_vencimiento": 15
}
```

**Proceso:**
1. Obtiene todas las matrículas con estado "Activa"
2. Para cada matrícula:
   - Verifica si ya existe factura para el periodo
   - Busca facturas vencidas y no pagadas (en mora)
   - Calcula mora al 3% mensual por cada mes vencido
   - Suma el valor base + valor de mora
   - Crea la nueva factura con observaciones de mora
   - Actualiza facturas anteriores a estado "Vencida"

**Respuesta:**
```json
{
  "message": "Proceso de facturación completado",
  "facturas_creadas": 15,
  "errores": 2,
  "detalle": {
    "exitosas": [
      {
        "matricula": "M001",
        "id_factura": 123,
        "valor_base": 50000,
        "valor_mora": 3000,
        "valor_total": 53000
      }
    ],
    "fallidas": [
      {
        "matricula": "M002",
        "error": "Ya existe factura para este periodo"
      }
    ]
  }
}
```

### Frontend (FacturasPage.jsx)

#### Características:

1. **Listado de Facturas**
   - Tabla con todas las facturas
   - Información de matrícula, periodo, fechas, valor y estado
   - Formato de moneda colombiana (COP)
   - Colores según estado (Pendiente, Pagada, Vencida)

2. **Filtros**
   - Filtrar por estado de factura
   - Botón de actualizar

3. **Nueva Factura Individual**
   - Modal con formulario para crear factura individual
   - Selector de matrícula con información del predio
   - Campos: matrícula, fecha vencimiento, valor, URL PDF
   - Validaciones de campos requeridos
   - Generación automática de URL si no se proporciona

4. **Generación Masiva**
   - Modal con formulario
   - Campos: periodo, valor base, días de vencimiento
   - Validaciones antes de generar
   - Confirmación con resumen
   - Indicador de progreso

5. **Resultado de Generación**
   - Banner con resumen de facturas creadas
   - Contador de éxitos y errores
   - Detalle de errores expandible

6. **Acciones por Factura**
   - Marcar como pagada
   - Ver PDF (si existe URL)

## Cálculo de Mora

**Fórmula:**
```
mora_factura = valor_factura × 0.03 × meses_vencidos
```

**Ejemplo:**
- Factura: $50,000
- Vencida hace: 2 meses
- Mora: $50,000 × 0.03 × 2 = $3,000
- Total nueva factura: $50,000 (base) + $3,000 (mora) = $53,000

## Validaciones

1. ✅ No duplicar facturas para el mismo periodo
2. ✅ Solo facturar matrículas activas
3. ✅ Calcular mora solo para facturas vencidas
4. ✅ Actualizar estado de facturas en mora
5. ✅ Registrar observaciones de mora en la factura

## Estados de Factura

- **Pendiente:** Factura emitida, no vencida, sin pagar
- **Pagada:** Factura pagada completamente
- **Vencida:** Factura que superó la fecha de vencimiento sin pagar
- **en_mora:** Factura vencida con mora acumulada

## Flujo de Uso

1. Administrador accede a "Gestión de Facturas"
2. Click en "Generar Facturas Masivo"
3. Completa el formulario:
   - Periodo (ej: "2025-01" o "Enero 2025")
   - Valor base (ej: 50000)
   - Días de vencimiento (ej: 15)
4. Confirma la generación
5. Sistema procesa todas las matrículas
6. Muestra resultado con éxitos y errores
7. Facturas aparecen en la tabla

## Notas Técnicas

- El periodo de facturación puede ser formato YYYY-MM o texto libre
- La mora se calcula automáticamente al 3% mensual
- Las facturas en mora se actualizan a estado "Vencida"
- El sistema previene duplicados por periodo
- Los errores no detienen el proceso completo
- Cada factura se procesa independientemente

## Mejoras Futuras

- [ ] Configurar porcentaje de mora desde la BD
- [ ] Generar PDF automáticamente
- [ ] Enviar notificaciones por email
- [ ] Programar facturación automática mensual
- [ ] Reportes de facturación
- [ ] Exportar a Excel
- [ ] Filtros avanzados (por rango de fechas, matrícula, etc.)
