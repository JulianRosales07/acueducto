# Modelo Entidad-Relación - Sistema de Mantenimiento de Fontanería

## Descripción General

Este modelo de base de datos está diseñado para gestionar un sistema de mantenimiento de fontanería, permitiendo el registro de predios, usuarios, solicitudes de mantenimiento y reportes de trabajos realizados. El sistema soporta diferentes tipos de usuarios (propietarios, encargados y fontaneros) y permite un seguimiento completo del ciclo de vida de las solicitudes de mantenimiento.

---

## Entidades Principales

### 1. PREDIO
Representa las propiedades o inmuebles que requieren servicios de mantenimiento de fontanería.

**Atributos:**
- `matricula` (PK) - VARCHAR(20) - Identificador único del predio
- `direccion` - VARCHAR(200) NOT NULL - Dirección física del inmueble
- `propietario` - VARCHAR(100) NOT NULL - Nombre del propietario
- `telefono` - VARCHAR(15) - Teléfono de contacto
- `email` - VARCHAR(100) - Correo electrónico de contacto
- `fecha_registro` - TIMESTAMP - Fecha de registro en el sistema (auto-generada)

**Restricciones:**
- La matrícula es única y obligatoria
- Dirección y propietario son campos obligatorios

---

### 2. USUARIO
Representa los usuarios del sistema con diferentes roles: propietarios, encargados y fontaneros.

**Atributos:**
- `cedula` (PK) - VARCHAR(20) - Cédula de identidad (identificador único)
- `nombre` - VARCHAR(100) NOT NULL - Nombre del usuario
- `apellido` - VARCHAR(100) NOT NULL - Apellido del usuario
- `telefono` - VARCHAR(15) - Teléfono de contacto
- `email` - VARCHAR(100) - Correo electrónico
- `tipo_usuario` - ENUM('propietario', 'encargado', 'fontanero') NOT NULL - Rol del usuario
- `fecha_registro` - TIMESTAMP - Fecha de registro (auto-generada)

**Restricciones:**
- La cédula es única y obligatoria
- Nombre, apellido y tipo de usuario son obligatorios
- El tipo de usuario debe ser uno de los valores permitidos

**Tipos de Usuario:**
- `propietario`: Dueño de uno o más predios
- `encargado`: Administrador o gestor de predios
- `fontanero`: Técnico que realiza los trabajos de mantenimiento

---

### 3. TIPO_MANTENIMIENTO
Catálogo de tipos de mantenimiento disponibles en el sistema.

**Atributos:**
- `id_tipo` (PK) - INT AUTO_INCREMENT - Identificador único del tipo
- `nombre` - VARCHAR(100) NOT NULL - Nombre del tipo de mantenimiento
- `descripcion` - TEXT - Descripción detallada del tipo de mantenimiento
- `activo` - BOOLEAN DEFAULT TRUE - Indica si el tipo está activo
- `fecha_creacion` - TIMESTAMP - Fecha de creación (auto-generada)

**Restricciones:**
- El nombre es obligatorio
- Por defecto, los tipos se crean como activos

**Ejemplos de Tipos:**
- Reparación de tuberías
- Instalación de sanitarios
- Mantenimiento preventivo
- Reparación de fugas
- Instalación de grifería

---

### 4. SOLICITUD_MANTENIMIENTO
Registra las solicitudes de mantenimiento realizadas por los usuarios para los predios.

**Atributos:**
- `codigo_solicitud` (PK) - VARCHAR(20) - Código único de la solicitud
- `matricula` (FK) - VARCHAR(20) NOT NULL - Referencia al predio
- `id_tipo` (FK) - INT NOT NULL - Referencia al tipo de mantenimiento
- `cedula_solicitante` (FK) - VARCHAR(20) NOT NULL - Referencia al usuario solicitante
- `fecha_solicitud` - TIMESTAMP - Fecha y hora de la solicitud (auto-generada)
- `observaciones` - TEXT - Observaciones o detalles adicionales
- `estado` - ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente'
- `prioridad` - ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media'

**Restricciones:**
- Código de solicitud único y obligatorio
- Matrícula, tipo y solicitante son obligatorios
- Estado por defecto: 'pendiente'
- Prioridad por defecto: 'media'

**Estados:**
- `pendiente`: Solicitud creada, esperando asignación
- `en_proceso`: Trabajo en curso
- `completado`: Trabajo finalizado
- `cancelado`: Solicitud cancelada

**Prioridades:**
- `baja`: No urgente
- `media`: Prioridad normal
- `alta`: Requiere atención pronta
- `urgente`: Requiere atención inmediata

---

### 5. REPORTE_MANTENIMIENTO
Registra los trabajos de mantenimiento realizados, incluyendo detalles técnicos y costos.

**Atributos:**
- `id_reporte` (PK) - INT AUTO_INCREMENT - Identificador único del reporte
- `codigo_solicitud` (FK) - VARCHAR(20) NOT NULL - Referencia a la solicitud
- `cedula_fontanero` (FK) - VARCHAR(20) - Referencia al fontanero que realizó el trabajo
- `fecha_realizacion` - TIMESTAMP - Fecha y hora de realización (auto-generada)
- `descripcion_trabajo` - TEXT NOT NULL - Descripción detallada del trabajo realizado
- `materiales_usados` - TEXT - Lista de materiales utilizados
- `costo` - DECIMAL(10,2) - Costo total del mantenimiento
- `estado_final` - ENUM('completado', 'requiere_seguimiento') DEFAULT 'completado'
- `observaciones_finales` - TEXT - Observaciones finales o recomendaciones

**Restricciones:**
- La descripción del trabajo es obligatoria
- Estado final por defecto: 'completado'
- El costo permite hasta 10 dígitos con 2 decimales

**Estados Finales:**
- `completado`: Trabajo finalizado sin pendientes
- `requiere_seguimiento`: Necesita revisión o trabajo adicional

---

## Relaciones

### 1. PREDIO → SOLICITUD_MANTENIMIENTO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un predio puede tener múltiples solicitudes de mantenimiento
- **Cardinalidad:** (1,1) - (0,N)
- **Clave Foránea:** `solicitud_mantenimiento.matricula` → `predio.matricula`
- **Regla de Negocio:** Cada solicitud debe estar asociada a un predio válido

### 2. USUARIO → SOLICITUD_MANTENIMIENTO (como Solicitante)
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un usuario puede crear múltiples solicitudes de mantenimiento
- **Cardinalidad:** (1,1) - (0,N)
- **Clave Foránea:** `solicitud_mantenimiento.cedula_solicitante` → `usuario.cedula`
- **Regla de Negocio:** El solicitante debe ser un usuario registrado (propietario o encargado)

### 3. TIPO_MANTENIMIENTO → SOLICITUD_MANTENIMIENTO
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un tipo de mantenimiento puede estar en múltiples solicitudes
- **Cardinalidad:** (1,1) - (1,N)
- **Clave Foránea:** `solicitud_mantenimiento.id_tipo` → `tipo_mantenimiento.id_tipo`
- **Regla de Negocio:** Cada solicitud debe tener un tipo de mantenimiento válido

### 4. SOLICITUD_MANTENIMIENTO → REPORTE_MANTENIMIENTO
- **Tipo:** 1:1 (Uno a Uno)
- **Descripción:** Una solicitud puede tener un reporte de mantenimiento
- **Cardinalidad:** (1,1) - (0,1)
- **Clave Foránea:** `reporte_mantenimiento.codigo_solicitud` → `solicitud_mantenimiento.codigo_solicitud`
- **Regla de Negocio:** El reporte se crea cuando se completa el trabajo

### 5. USUARIO → REPORTE_MANTENIMIENTO (como Fontanero)
- **Tipo:** 1:N (Uno a Muchos)
- **Descripción:** Un fontanero puede realizar múltiples reportes de mantenimiento
- **Cardinalidad:** (1,1) - (0,N)
- **Clave Foránea:** `reporte_mantenimiento.cedula_fontanero` → `usuario.cedula`
- **Regla de Negocio:** El fontanero debe ser un usuario con tipo 'fontanero'

---

## Índices para Optimización

El sistema incluye índices para mejorar el rendimiento de las consultas más frecuentes:

1. **idx_solicitud_estado** - Índice en `solicitud_mantenimiento.estado`
   - Optimiza consultas de filtrado por estado de solicitudes
   - Útil para dashboards y reportes de estado

2. **idx_solicitud_fecha** - Índice en `solicitud_mantenimiento.fecha_solicitud`
   - Optimiza consultas de búsqueda por rango de fechas
   - Útil para reportes históricos y estadísticas

3. **idx_reporte_fecha** - Índice en `reporte_mantenimiento.fecha_realizacion`
   - Optimiza consultas de reportes por fecha
   - Útil para análisis de productividad y costos

---

## Diagrama Textual del Modelo

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TIPO_MANTENIMIENTO                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ id_tipo (PK)                                                 │   │
│  │ nombre                                                       │   │
│  │ descripcion                                                  │   │
│  │ activo                                                       │   │
│  │ fecha_creacion                                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ clasifica (1:N)
                                 ↓
┌──────────────────────┐    ┌────────────────────────────────────────┐
│      PREDIO          │    │      SOLICITUD_MANTENIMIENTO           │
│  ┌────────────────┐  │    │  ┌──────────────────────────────────┐  │
│  │ matricula (PK) │  │    │  │ codigo_solicitud (PK)            │  │
│  │ direccion      │  │    │  │ matricula (FK)                   │  │
│  │ propietario    │  │    │  │ id_tipo (FK)                     │  │
│  │ telefono       │  │    │  │ cedula_solicitante (FK)          │  │
│  │ email          │  │    │  │ fecha_solicitud                  │  │
│  │ fecha_registro │  │    │  │ observaciones                    │  │
│  └────────────────┘  │    │  │ estado                           │  │
└──────┬───────────────┘    │  │ prioridad                        │  │
       │ tiene (1:N)        │  └──────────────────────────────────┘  │
       └────────────────────┴──────────────┬───────────────────────┬─┘
                                           │                       │
                                           │ genera (1:1)          │ solicita (1:N)
                                           ↓                       │
                            ┌──────────────────────────────────┐   │
                            │   REPORTE_MANTENIMIENTO          │   │
                            │  ┌────────────────────────────┐  │   │
                            │  │ id_reporte (PK)            │  │   │
                            │  │ codigo_solicitud (FK)      │  │   │
                            │  │ cedula_fontanero (FK)      │  │   │
                            │  │ fecha_realizacion          │  │   │
                            │  │ descripcion_trabajo        │  │   │
                            │  │ materiales_usados          │  │   │
                            │  │ costo                      │  │   │
                            │  │ estado_final               │  │   │
                            │  │ observaciones_finales      │  │   │
                            │  └────────────────────────────┘  │   │
                            └──────────────┬───────────────────┘   │
                                           │ realiza (1:N)         │
                                           │                       │
                                           ↓                       ↓
                                    ┌──────────────────────────────────┐
                                    │          USUARIO                 │
                                    │  ┌────────────────────────────┐  │
                                    │  │ cedula (PK)                │  │
                                    │  │ nombre                     │  │
                                    │  │ apellido                   │  │
                                    │  │ telefono                   │  │
                                    │  │ email                      │  │
                                    │  │ tipo_usuario               │  │
                                    │  │ fecha_registro             │  │
                                    │  └────────────────────────────┘  │
                                    └──────────────────────────────────┘
```

---

## Reglas de Integridad Referencial

1. **ON DELETE/UPDATE:** No se especifican acciones en cascada para mantener la integridad histórica
2. **Restricciones de Clave Foránea:**
   - No se pueden eliminar predios con solicitudes asociadas
   - No se pueden eliminar usuarios con solicitudes o reportes asociados
   - No se pueden eliminar tipos de mantenimiento en uso

---

## Flujo de Datos Típico

1. **Registro de Predio:** Se registra un predio con su información básica
2. **Registro de Usuario:** Se registran usuarios (propietarios, encargados, fontaneros)
3. **Creación de Solicitud:** Un usuario crea una solicitud de mantenimiento para un predio
4. **Asignación:** La solicitud cambia a estado 'en_proceso'
5. **Ejecución:** Un fontanero realiza el trabajo
6. **Reporte:** Se crea un reporte con los detalles del trabajo realizado
7. **Cierre:** La solicitud cambia a estado 'completado'

---

## Consideraciones de Diseño

- **Normalización:** El modelo está en 3FN (Tercera Forma Normal)
- **Escalabilidad:** Los índices permiten un buen rendimiento con grandes volúmenes de datos
- **Trazabilidad:** Todas las tablas incluyen timestamps para auditoría
- **Flexibilidad:** Los campos TEXT permiten información detallada sin límites estrictos
- **Validación:** Los ENUM garantizan valores consistentes en campos críticos
