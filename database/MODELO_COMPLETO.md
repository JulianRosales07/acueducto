# Modelo de Base de Datos - Sistema de Acueducto y Mantenimiento

## Descripción General
Base de datos diseñada para gestionar un sistema integral de acueducto que incluye:
- Gestión de usuarios y predios
- Matrículas de acueducto
- Facturación y pagos
- Solicitudes y reportes de mantenimiento

## Tablas Principales

### 1. PREDIO
Representa las propiedades físicas (casas, lotes, apartamentos, locales).
- **Clave primaria**: `id_predio`
- **Campos importantes**: dirección, tipo_predio, área

### 2. USUARIO
Almacena información de todos los usuarios del sistema.
- **Clave primaria**: `cedula`
- **Tipos**: propietario, encargado, fontanero
- Un usuario puede tener múltiples matrículas

### 3. MATRICULA
**Tabla central** que relaciona usuarios con predios.
- **Clave primaria**: `numero_matricula`
- **Relaciones**: 
  - Un predio → Una matrícula
  - Un usuario → Múltiples matrículas
- **Estados**: activa, suspendida, cancelada

### 4. FACTURA
Gestiona la facturación del servicio de acueducto.
- **Clave primaria**: `codigo_factura`
- **Campos de cálculo**:
  - `consumo_m3`: Metros cúbicos consumidos
  - `valor_consumo`: Costo del consumo
  - `valor_mantenimiento`: Tarifa base
  - `valor_mora`: Mora por pagos atrasados
  - `total`: Valor total a pagar
- **Estados**: pendiente, pagada, vencida, en_mora

### 5. DETALLE_FACTURA
Conceptos adicionales en cada factura (items detallados).

### 6. PAGO
Registro de pagos realizados sobre facturas.
- Permite pagos parciales
- Métodos: efectivo, transferencia, tarjeta, cheque

### 7. CONFIGURACION_FACTURACION
Parámetros del sistema de facturación:
- Datos del acueducto (nombre, NIT, logo)
- Tarifas (base, por m³)
- Porcentaje de mora
- Días de vencimiento

### 8. SOLICITUD_MANTENIMIENTO
Solicitudes de mantenimiento para una matrícula.
- **Relación**: matrícula → solicitud
- **Estados**: pendiente, en_proceso, completado, cancelado
- **Prioridades**: baja, media, alta, urgente

### 9. REPORTE_MANTENIMIENTO
Registro del trabajo realizado por fontaneros.
- Vinculado a una solicitud
- Incluye costos, materiales, descripción

### 10. TIPO_MANTENIMIENTO
Catálogo de tipos de mantenimiento disponibles.

## Funcionalidades Soportadas

### ✅ Historia 1: Facturar
- Generar facturas para todas las matrículas
- Validar facturas en mora
- Calcular mora automáticamente
- Incorporar pagos pendientes

### ✅ Historia 2: Generar PDF de Factura
- Datos del acueducto (logo, nombre, NIT)
- Datos del usuario y matrícula
- Detalles de facturación
- Fechas de emisión y vencimiento

### ✅ Historia 3: Consultar/Descargar Factura
- Búsqueda por código de factura
- Búsqueda por cédula (todas las facturas del usuario)
- Visualización en PDF
- Descarga y compartir

### ✅ Historia 4: Generación de Matrícula
- Crear matrícula sobre un predio
- Asociar a un usuario propietario
- Un usuario puede tener múltiples matrículas

### ✅ Historia 5: Consulta de Matrículas
- Por número de matrícula
- Por cédula de usuario (todas sus matrículas)

### ✅ Historia 6: Solicitud de Mantenimiento
- Registrar solicitud para una matrícula
- Seleccionar tipo de mantenimiento
- Agregar observaciones
- Asignar prioridad

### ✅ Historia 7: Reporte de Mantenimiento
- Registrar trabajo realizado
- Búsqueda por código de solicitud, matrícula o cédula
- Registrar materiales y costos

## Relaciones Clave

```
USUARIO (1) ←→ (N) MATRICULA (N) ←→ (1) PREDIO
    ↓                    ↓
    |                    |
    |              SOLICITUD_MANTENIMIENTO
    |                    ↓
    |              REPORTE_MANTENIMIENTO
    |
    └──→ FACTURA ←──→ DETALLE_FACTURA
           ↓
         PAGO
```

## Índices para Rendimiento

Se han creado índices en:
- Estados de solicitudes y facturas
- Fechas de solicitud, reporte y pago
- Relaciones matrícula-propietario
- Búsquedas por usuario y matrícula

## Validaciones Importantes

1. **Facturación con mora**: 
   - Verificar facturas vencidas antes de generar nueva
   - Calcular mora según `porcentaje_mora` en configuración

2. **Matrículas**:
   - Un predio solo puede tener una matrícula activa
   - Validar estado antes de facturar

3. **Pagos**:
   - Actualizar estado de factura al registrar pago
   - Permitir pagos parciales

## Datos de Ejemplo

El archivo `seed.sql` incluye:
- 6 usuarios (propietarios, encargados, fontaneros)
- 5 predios de diferentes tipos
- 5 matrículas activas
- Facturas de ejemplo (pagadas, pendientes, en mora)
- Configuración inicial del acueducto
