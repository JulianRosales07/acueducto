-- Base de datos para Sistema de Mantenimiento de Fontanería y Acueducto
CREATE DATABASE IF NOT EXISTS mantenimiento_fontaneria2;
USE mantenimiento_fontaneria2;

-- Tabla PREDIO
CREATE TABLE predio (
    id_predio INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla USUARIO
CREATE TABLE usuario (
    cedula VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100),
    tipo_usuario ENUM('propietario', 'encargado', 'fontanero') NOT NULL,
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
    matricula VARCHAR(20) NOT NULL,
    id_tipo INT NOT NULL,
    cedula_solicitante VARCHAR(20) NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    estado ENUM('pendiente', 'en_proceso', 'completado', 'cancelado') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    FOREIGN KEY (matricula) REFERENCES predio(matricula),
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
    periodo_facturacion VARCHAR(20) NOT NULL, -- Ej: "2025-01", "Enero 2025"
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

-- Tabla DETALLE_FACTURA (para items adicionales en la factura)
CREATE TABLE detalle_factura (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    codigo_factura VARCHAR(20) NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 1,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (codigo_factura) REFERENCES factura(codigo_factura)
);

-- Tabla PAGO (registro de pagos realizados)
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

-- Tabla CONFIGURACION_FACTURACION (parámetros del sistema)
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
    porcentaje_mora DECIMAL(5,2) DEFAULT 0, -- Porcentaje de mora mensual
    dias_vencimiento INT DEFAULT 15, -- Días para vencimiento desde emisión
    activo BOOLEAN DEFAULT TRUE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_solicitud_estado ON solicitud_mantenimiento(estado);
CREATE INDEX idx_solicitud_fecha ON solicitud_mantenimiento(fecha_solicitud);
CREATE INDEX idx_solicitud_matricula ON solicitud_mantenimiento(matricula);
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


