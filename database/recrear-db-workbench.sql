-- ========================================
-- RECREAR BASE DE DATOS
-- ========================================
-- Ejecuta este archivo completo en MySQL Workbench
-- Selecciona todo (Ctrl+A) y ejecuta (Ctrl+Shift+Enter)

-- 1. Eliminar base de datos anterior
DROP DATABASE IF EXISTS mantenimiento_fontaneria;

-- 2. Crear base de datos
CREATE DATABASE IF NOT EXISTS mantenimiento_fontaneria;
USE mantenimiento_fontaneria;

-- 3. Crear tablas
-- Tabla PREDIO (lote, casa)
CREATE TABLE predio (
    id_predio INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(200) NOT NULL,
    tipo_predio ENUM('casa', 'lote', 'apartamento', 'local') DEFAULT 'casa',
    area_metros DECIMAL(10,2),
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla USUARIO
CREATE TABLE usuario (
    cedula VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion VARCHAR(200),
    tipo_usuario ENUM('propietario', 'encargado', 'fontanero') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla MATRICULA (relación entre usuario y predio)
CREATE TABLE matricula (
    numero_matricula VARCHAR(20) PRIMARY KEY,
    id_predio INT NOT NULL,
    cedula_propietario VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'suspendida', 'cancelada') DEFAULT 'activa',
    observaciones TEXT,
    FOREIGN KEY (id_predio) REFERENCES predio(id_predio),
    FOREIGN KEY (cedula_propietario) REFERENCES usuario(cedula)
);

-- Tabla TIPO_MANTENIMIENTO
CREATE TABLE tipo_mantenimiento (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla SOLICITUD_MANTENIMIENTO
CREATE TABLE solicitud_mantenimiento (
    codigo_solicitud VARCHAR(20) PRIMARY KEY,
    numero_matricula VARCHAR(20) NOT NULL,
    id_tipo INT NOT NULL,
    cedula_solicitante VARCHAR(20) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    estado ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    FOREIGN KEY (numero_matricula) REFERENCES matricula(numero_matricula),
    FOREIGN KEY (id_tipo) REFERENCES tipo_mantenimiento(id_tipo),
    FOREIGN KEY (cedula_solicitante) REFERENCES usuario(cedula)
);

-- Tabla REPORTE_MANTENIMIENTO
CREATE TABLE reporte_mantenimiento (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(20) NOT NULL,
    cedula_fontanero VARCHAR(20),
    fecha_realizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion_trabajo TEXT NOT NULL,
    materiales_usados TEXT,
    costo DECIMAL(10,2),
    estado_final ENUM('completado', 'requiere_seguimiento') DEFAULT 'completado',
    observaciones_finales TEXT,
    FOREIGN KEY (codigo_solicitud) REFERENCES solicitud_mantenimiento(codigo_solicitud),
    FOREIGN KEY (cedula_fontanero) REFERENCES usuario(cedula)
);

-- Tabla FACTURA
CREATE TABLE factura (
    codigo_factura VARCHAR(20) PRIMARY KEY,
    numero_matricula VARCHAR(20) NOT NULL,
    cedula_usuario VARCHAR(20) NOT NULL,
    periodo_facturacion VARCHAR(20) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    consumo_m3 DECIMAL(10,2) DEFAULT 0,
    valor_consumo DECIMAL(10,2) DEFAULT 0,
    valor_mantenimiento DECIMAL(10,2) DEFAULT 0,
    valor_otros DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    valor_mora DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'pagada', 'vencida', 'en_mora') DEFAULT 'pendiente',
    fecha_pago TIMESTAMP NULL,
    metodo_pago VARCHAR(50),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (numero_matricula) REFERENCES matricula(numero_matricula),
    FOREIGN KEY (cedula_usuario) REFERENCES usuario(cedula)
);

-- Tabla DETALLE_FACTURA
CREATE TABLE detalle_factura (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    codigo_factura VARCHAR(20) NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 1,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (codigo_factura) REFERENCES factura(codigo_factura)
);

-- Tabla PAGO
CREATE TABLE pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    codigo_factura VARCHAR(20) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta', 'cheque') NOT NULL,
    referencia_pago VARCHAR(100),
    cedula_quien_paga VARCHAR(20),
    observaciones TEXT,
    FOREIGN KEY (codigo_factura) REFERENCES factura(codigo_factura),
    FOREIGN KEY (cedula_quien_paga) REFERENCES usuario(cedula)
);

-- Tabla CONFIGURACION_FACTURACION
CREATE TABLE configuracion_facturacion (
    id_config INT AUTO_INCREMENT PRIMARY KEY,
    nombre_acueducto VARCHAR(200) NOT NULL,
    logo_url VARCHAR(500),
    nit VARCHAR(20),
    direccion VARCHAR(200),
    telefono VARCHAR(15),
    email VARCHAR(100),
    tarifa_base DECIMAL(10,2) DEFAULT 0,
    tarifa_por_m3 DECIMAL(10,2) DEFAULT 0,
    porcentaje_mora DECIMAL(5,2) DEFAULT 0,
    dias_vencimiento INT DEFAULT 15,
    activo BOOLEAN DEFAULT TRUE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_solicitud_estado ON solicitud_mantenimiento(estado);
CREATE INDEX idx_solicitud_fecha ON solicitud_mantenimiento(fecha_solicitud);
CREATE INDEX idx_solicitud_matricula ON solicitud_mantenimiento(numero_matricula);
CREATE INDEX idx_reporte_fecha ON reporte_mantenimiento(fecha_realizacion);
CREATE INDEX idx_matricula_propietario ON matricula(cedula_propietario);
CREATE INDEX idx_matricula_estado ON matricula(estado);
CREATE INDEX idx_factura_matricula ON factura(numero_matricula);
CREATE INDEX idx_factura_usuario ON factura(cedula_usuario);
CREATE INDEX idx_factura_estado ON factura(estado);
CREATE INDEX idx_factura_periodo ON factura(periodo_facturacion);
CREATE INDEX idx_factura_vencimiento ON factura(fecha_vencimiento);
CREATE INDEX idx_pago_factura ON pago(codigo_factura);
CREATE INDEX idx_pago_fecha ON pago(fecha_pago);

-- 4. Insertar datos de prueba
-- Configuración del acueducto
INSERT INTO configuracion_facturacion (nombre_acueducto, nit, direccion, telefono, email, tarifa_base, tarifa_por_m3, porcentaje_mora, dias_vencimiento) VALUES
('Acueducto Municipal San José', '900123456-7', 'Calle Principal #10-20', '3101234567', 'info@acueductosanjose.com', 15000.00, 2500.00, 2.5, 15);

-- Tipos de mantenimiento
INSERT INTO tipo_mantenimiento (nombre, descripcion) VALUES
('Reparación de fuga', 'Reparación de fugas en tuberías o conexiones'),
('Instalación de tubería', 'Instalación de nuevas tuberías'),
('Mantenimiento preventivo', 'Revisión y mantenimiento preventivo del sistema'),
('Cambio de válvulas', 'Reemplazo de válvulas defectuosas'),
('Limpieza de tanques', 'Limpieza y desinfección de tanques de agua'),
('Destape de tuberías', 'Destape de tuberías obstruidas');

-- Usuarios
INSERT INTO usuario (cedula, nombre, apellido, telefono, email, direccion, tipo_usuario) VALUES
('1001234567', 'Juan', 'Pérez', '3001234567', 'juan.perez@email.com', 'Calle 10 #20-30', 'propietario'),
('1002345678', 'María', 'González', '3002345678', 'maria.gonzalez@email.com', 'Carrera 5 #15-20', 'encargado'),
('1003456789', 'Carlos', 'Rodríguez', '3003456789', 'carlos.rodriguez@email.com', 'Avenida 8 #12-15', 'fontanero'),
('1004567890', 'Ana', 'Martínez', '3004567890', 'ana.martinez@email.com', 'Calle 12 #8-10', 'fontanero'),
('1005678901', 'Pedro', 'López', '3005678901', 'pedro.lopez@email.com', 'Carrera 15 #25-40', 'propietario'),
('1006789012', 'Laura', 'Sánchez', '3006789012', 'laura.sanchez@email.com', 'Avenida 5 #30-50', 'propietario');

-- Predios
INSERT INTO predio (direccion, tipo_predio, area_metros, descripcion) VALUES
('Calle 10 #20-30', 'casa', 120.00, 'Casa de dos pisos con jardín'),
('Carrera 15 #25-40', 'casa', 85.50, 'Casa unifamiliar'),
('Avenida 5 #30-50', 'apartamento', 65.00, 'Apartamento segundo piso'),
('Calle 8 #15-25', 'local', 45.00, 'Local comercial'),
('Carrera 20 #10-15', 'lote', 200.00, 'Lote sin construcción');

-- Matrículas
INSERT INTO matricula (numero_matricula, id_predio, cedula_propietario, observaciones) VALUES
('MAT-2025-001', 1, '1001234567', 'Primera matrícula del sistema'),
('MAT-2025-002', 2, '1005678901', 'Matrícula activa'),
('MAT-2025-003', 3, '1006789012', 'Matrícula activa'),
('MAT-2025-004', 4, '1001234567', 'Segunda propiedad del usuario'),
('MAT-2025-005', 5, '1005678901', 'Lote en desarrollo');

-- Solicitudes de mantenimiento
INSERT INTO solicitud_mantenimiento (codigo_solicitud, numero_matricula, id_tipo, cedula_solicitante, observaciones, prioridad) VALUES
('SOL-2025-001', 'MAT-2025-001', 1, '1002345678', 'Fuga en el baño principal', 'alta'),
('SOL-2025-002', 'MAT-2025-002', 3, '1002345678', 'Mantenimiento anual programado', 'media'),
('SOL-2025-003', 'MAT-2025-003', 6, '1002345678', 'Tubería de la cocina obstruida', 'urgente');

-- Facturas
INSERT INTO factura (codigo_factura, numero_matricula, cedula_usuario, periodo_facturacion, fecha_emision, fecha_vencimiento, consumo_m3, valor_consumo, valor_mantenimiento, subtotal, total, estado) VALUES
('FACT-2025-001', 'MAT-2025-001', '1001234567', '2025-01', '2025-01-01', '2025-01-16', 8.5, 21250.00, 15000.00, 36250.00, 36250.00, 'pagada'),
('FACT-2025-002', 'MAT-2025-002', '1005678901', '2025-01', '2025-01-01', '2025-01-16', 6.2, 15500.00, 15000.00, 30500.00, 30500.00, 'pendiente'),
('FACT-2025-003', 'MAT-2025-003', '1006789012', '2025-01', '2025-01-01', '2025-01-16', 4.8, 12000.00, 15000.00, 27000.00, 27000.00, 'pendiente'),
('FACT-2024-012', 'MAT-2025-001', '1001234567', '2024-12', '2024-12-01', '2024-12-16', 7.5, 18750.00, 15000.00, 33750.00, 33750.00, 'pagada'),
('FACT-2024-011', 'MAT-2025-002', '1005678901', '2024-11', '2024-11-01', '2024-11-16', 5.5, 13750.00, 15000.00, 28750.00, 31612.50, 'en_mora');

-- Detalles de factura
INSERT INTO detalle_factura (codigo_factura, concepto, cantidad, valor_unitario, valor_total) VALUES
('FACT-2025-001', 'Tarifa básica', 1, 15000.00, 15000.00),
('FACT-2025-001', 'Consumo 8.5 m³', 8.5, 2500.00, 21250.00),
('FACT-2025-002', 'Tarifa básica', 1, 15000.00, 15000.00),
('FACT-2025-002', 'Consumo 6.2 m³', 6.2, 2500.00, 15500.00);

-- Pagos
INSERT INTO pago (codigo_factura, fecha_pago, monto_pagado, metodo_pago, referencia_pago, cedula_quien_paga) VALUES
('FACT-2025-001', '2025-01-10 14:30:00', 36250.00, 'transferencia', 'REF-20250110-001', '1001234567'),
('FACT-2024-012', '2024-12-12 10:15:00', 33750.00, 'efectivo', NULL, '1001234567');

-- ========================================
-- COMPLETADO
-- ========================================
SELECT 'Base de datos recreada exitosamente!' as Mensaje;
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM usuario
UNION ALL SELECT 'Predios', COUNT(*) FROM predio
UNION ALL SELECT 'Matrículas', COUNT(*) FROM matricula
UNION ALL SELECT 'Solicitudes', COUNT(*) FROM solicitud_mantenimiento
UNION ALL SELECT 'Facturas', COUNT(*) FROM factura;
