-- =======================================================
-- BASE DE DATOS: SISTEMA PREDIAL COMPLETO (PostgreSQL/Supabase)
-- - Factura <-> Pago: 1 a 1 (pago.id_factura = PK + FK a factura.id)
-- - Matricula <-> Solicitud: 1 a N (solicitud.cod_matricula NOT NULL a matricula)
-- - Eliminada relación Predio <-> Solicitud
-- =======================================================

-- Limpieza opcional (solo para desarrollo; comentar en producción)
-- DROP TABLE IF EXISTS solicitud_mantenimiento CASCADE;
-- DROP TABLE IF EXISTS mantenimiento CASCADE;
-- DROP TABLE IF EXISTS pago CASCADE;
-- DROP TABLE IF EXISTS factura CASCADE;
-- DROP TABLE IF EXISTS matricula CASCADE;
-- DROP TABLE IF EXISTS predio CASCADE;
-- DROP TABLE IF EXISTS propietario CASCADE;
-- DROP TABLE IF EXISTS usuario CASCADE;

-- 1) Usuario
CREATE TABLE IF NOT EXISTS usuario (
  cc             VARCHAR(15) PRIMARY KEY,
  nombre         VARCHAR(50)  NOT NULL,
  apellido       VARCHAR(50)  NOT NULL,
  telefono       VARCHAR(20),
  correo         VARCHAR(100),
  fecha_registro DATE
);

-- 2) Propietario
CREATE TABLE IF NOT EXISTS propietario (
  cc       VARCHAR(15) PRIMARY KEY,
  nombre   VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  telefono VARCHAR(20),
  correo   VARCHAR(100)
);

-- 3) Predio (FK a propietario)
CREATE TABLE IF NOT EXISTS predio (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  direccion      VARCHAR(150) NOT NULL,
  propietario_cc VARCHAR(15),
  telefono       VARCHAR(20),
  correo         VARCHAR(100),
  fecha_registro DATE,
  tipo           VARCHAR(50),
  CONSTRAINT fk_predio_propietario
    FOREIGN KEY (propietario_cc) REFERENCES propietario(cc)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_predio_propietario ON predio (propietario_cc);

-- 4) Matricula (FK a predio)
CREATE TABLE IF NOT EXISTS matricula (
  cod_matricula VARCHAR(20) PRIMARY KEY,
  id_predio     BIGINT NOT NULL,
  estado        VARCHAR(50),
  fecha         DATE,
  CONSTRAINT fk_matricula_predio
    FOREIGN KEY (id_predio) REFERENCES predio(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_matricula_predio ON matricula (id_predio);
CREATE INDEX IF NOT EXISTS idx_matricula_estado ON matricula (estado);

-- 5) Factura (FK a matricula)
CREATE TABLE IF NOT EXISTS factura (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cod_matricula     VARCHAR(20) NOT NULL,
  fecha_creacion    DATE,
  fecha_vencimiento DATE,
  valor             NUMERIC(10,2),
  estado            VARCHAR(50),
  url               VARCHAR(200),
  CONSTRAINT fk_factura_matricula
    FOREIGN KEY (cod_matricula) REFERENCES matricula(cod_matricula)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_factura_matricula   ON factura (cod_matricula);
CREATE INDEX IF NOT EXISTS idx_factura_estado_venc ON factura (estado, fecha_vencimiento);

-- 6) Pago (1:1 con Factura)
-- Regla: una factura tiene a lo sumo un pago y un pago pertenece a exactamente una factura.
-- Implementación: id_factura es PRIMARY KEY y FK a factura(id).
CREATE TABLE IF NOT EXISTS pago (
  id_factura  BIGINT PRIMARY KEY,
  fecha_pago  DATE,
  metodo_pago VARCHAR(50),
  valor       NUMERIC(10,2),
  CONSTRAINT fk_pago_factura
    FOREIGN KEY (id_factura) REFERENCES factura(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7) Mantenimiento (catálogo)
CREATE TABLE IF NOT EXISTS mantenimiento (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado      VARCHAR(50),
  fecha       DATE
);

-- 8) Solicitud de Mantenimiento
-- Requisito: 1:N desde matricula -> solicitud_mantenimiento
-- NOTA: Sin relación a predio (no hay id_predio)
CREATE TABLE IF NOT EXISTS solicitud_mantenimiento (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_mantenimiento BIGINT,
  cod_matricula    VARCHAR(20) NOT NULL,
  estado           VARCHAR(50),
  observaciones    TEXT,
  prioridad        VARCHAR(50),
  CONSTRAINT fk_solmant_mantenimiento
    FOREIGN KEY (id_mantenimiento) REFERENCES mantenimiento(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_solmant_matricula
    FOREIGN KEY (cod_matricula) REFERENCES matricula(cod_matricula)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_solmant_mantenimiento ON solicitud_mantenimiento (id_mantenimiento);
CREATE INDEX IF NOT EXISTS idx_solmant_cod_matricula ON solicitud_mantenimiento (cod_matricula);

-- =======================================================
-- DATOS DE PRUEBA
-- =======================================================

-- USUARIOS
INSERT INTO usuario (cc, nombre, apellido, telefono, correo, fecha_registro) VALUES
('1001', 'Laura', 'Jiménez', '3145678901', 'laura@correo.com', '2025-01-15'),
('1002', 'Pedro', 'Salazar', '3158907654', 'pedro@correo.com', '2025-02-10');

-- PROPIETARIOS
INSERT INTO propietario (cc, nombre, apellido, telefono, correo) VALUES
('2001', 'Carlos', 'Muñoz', '3174567890', 'carlos@correo.com'),
('2002', 'María',  'López', '3126549870', 'maria@correo.com');

-- PREDIOS
INSERT INTO predio (direccion, propietario_cc, telefono, correo, fecha_registro, tipo) VALUES
('Calle 12 #4-56', '2001', '3174567890', 'carlos@correo.com', '2025-03-05', 'Residencial'),
('Av. Central 89', '2002', '3126549870', 'maria@correo.com',  '2025-03-10', 'Comercial');

-- MATRÍCULAS
INSERT INTO matricula (cod_matricula, id_predio, estado, fecha) VALUES
('M001', 1, 'Activa', '2025-03-06'),
('M002', 2, 'Activa', '2025-03-11');

-- FACTURAS
INSERT INTO factura (cod_matricula, fecha_creacion, fecha_vencimiento, valor, estado, url) VALUES
('M001', '2025-07-01', '2025-07-31', 350000, 'Pendiente', 'facturas/factura_M001.pdf'),
('M002', '2025-07-01', '2025-07-31', 280000, 'Pagada',    'facturas/factura_M002.pdf');

-- PAGOS (1:1) => id_factura debe existir en FACTURA(id)
-- Asumiendo que los IDs autogenerados de factura quedaron 1 y 2
INSERT INTO pago (id_factura, fecha_pago, metodo_pago, valor) VALUES
(1, '2025-07-15', 'Transferencia', 350000),
(2, '2025-07-10', 'Efectivo',      280000);

-- MANTENIMIENTOS
INSERT INTO mantenimiento (nombre, descripcion, estado, fecha) VALUES
('Revisión Eléctrica',        'Inspección del sistema eléctrico',         'Completado', '2025-06-20'),
('Limpieza de Alcantarillado','Mantenimiento preventivo de drenajes',     'Pendiente',  '2025-06-25');

-- SOLICITUDES DE MANTENIMIENTO (1:N desde MATRICULA)
INSERT INTO solicitud_mantenimiento (id_mantenimiento, cod_matricula, estado, observaciones, prioridad) VALUES
(1, 'M001', 'Finalizada', 'Se realizó cambio de cableado', 'Alta'),
(2, 'M002', 'Pendiente',  'Requiere limpieza urgente',     'Alta');
