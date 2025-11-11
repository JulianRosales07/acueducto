# Historias de Usuario - Sistema de Mantenimiento

## HU-01: Solicitar Mantenimiento para Predio
**Como** encargado del sistema  
**Quiero** registrar una solicitud de mantenimiento para un fontanero  
**Para** gestionar las necesidades de mantenimiento de los predios

### Criterios de Aceptación:
- Puedo ingresar el número de matrícula del predio
- El sistema muestra los datos del predio para consulta
- Puedo seleccionar el tipo de mantenimiento desde una lista predefinida
- Puedo agregar observaciones sobre el mantenimiento solicitado
- El sistema genera un código único de solicitud

### Datos Requeridos:
- Número de matrícula (obligatorio)
- Tipo de mantenimiento (obligatorio, desde lista)
- Observaciones (opcional)

---

## HU-02: Registrar Reporte de Mantenimiento Realizado
**Como** fontanero o encargado del sistema  
**Quiero** registrar el mantenimiento que fue realizado  
**Para** llevar un historial de los trabajos completados

### Criterios de Aceptación:
- Puedo buscar la solicitud por código de mantenimiento
- Puedo buscar la solicitud por número de matrícula
- Puedo buscar la solicitud por cédula de usuario
- Puedo registrar los detalles del mantenimiento realizado
- El sistema actualiza el estado de la solicitud

### Datos Requeridos:
- Código de mantenimiento, número de matrícula o cédula (uno obligatorio)
- Fecha de realización
- Descripción del trabajo realizado
- Estado final

---

## HU-03: Consultar Datos del Predio
**Como** encargado del sistema  
**Quiero** consultar los datos de un predio por su matrícula  
**Para** verificar la información antes de crear una solicitud

### Criterios de Aceptación:
- Puedo buscar por número de matrícula
- El sistema muestra: dirección, propietario, contacto
- El sistema muestra historial de mantenimientos previos

---

## HU-04: Gestionar Tipos de Mantenimiento
**Como** administrador del sistema  
**Quiero** mantener un catálogo de tipos de mantenimiento  
**Para** estandarizar las solicitudes

### Criterios de Aceptación:
- Puedo agregar nuevos tipos de mantenimiento
- Puedo editar tipos existentes
- Puedo desactivar tipos obsoletos

### Ejemplos de Tipos:
- Reparación de fuga
- Instalación de tubería
- Mantenimiento preventivo
- Cambio de válvulas
- Limpieza de tanques
