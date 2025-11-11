-- Datos de prueba para el sistema
USE mantenimiento_fontaneria2;

-- Insertar configuración del acueducto
INSERT INTO configuracion_facturacion (nombre_acueducto, nit, direccion, telefono, email, tarifa_base, tarifa_por_m3, porcentaje_mora, dias_vencimiento) VALUES
('Acueducto Municipal San José', '900123456-7', 'Calle Principal #10-20', '3101234567', 'info@acueductosanjose.com', 15000.00, 2500.00, 2.5, 15);

-- Insertar tipos de mantenimiento
INSERT INTO tipo_mantenimiento (nombre, descripcion) VALUES
('Reparación de fuga', 'Reparación de fugas en tuberías o conexiones'),
('Instalación de tubería', 'Instalación de nuevas tuberías'),
('Mantenimiento preventivo', 'Revisión y mantenimiento preventivo del sistema'),
('Cambio de válvulas', 'Reemplazo de válvulas defectuosas'),
('Limpieza de tanques', 'Limpieza y desinfección de tanques de agua'),
('Destape de tuberías', 'Destape de tuberías obstruidas'),
('Revisión de medidor', 'Revisión y calibración de medidores'),
('Reparación de bomba', 'Reparación o cambio de bombas de agua');

-- Insertar usuarios
INSERT INTO usuario (cedula, nombre, apellido, telefono, email, tipo_usuario) VALUES
('1001234567', 'Juan', 'Pérez', '3001234567', 'juan.perez@email.com', 'propietario'),
('1002345678', 'María', 'González', '3002345678', 'maria.gonzalez@email.com', 'encargado'),
('1003456789', 'Carlos', 'Rodríguez', '3003456789', 'carlos.rodriguez@email.com', 'fontanero'),
('1004567890', 'Ana', 'Martínez', '3004567890', 'ana.martinez@email.com', 'fontanero'),
('1005678901', 'Pedro', 'López', '3005678901', 'pedro.lopez@email.com', 'propietario'),
('1006789012', 'Laura', 'Sánchez', '3006789012', 'laura.sanchez@email.com', 'propietario'),
('1007890123', 'Roberto', 'Gómez', '3007890123', 'roberto.gomez@email.com', 'propietario'),
('1008901234', 'Diana', 'Torres', '3008901234', 'diana.torres@email.com', 'propietario'),
('1009012345', 'Luis', 'Ramírez', '3009012345', 'luis.ramirez@email.com', 'fontanero'),
('1010123456', 'Carmen', 'Vargas', '3010123456', 'carmen.vargas@email.com', 'propietario'),
('1011234567', 'Jorge', 'Morales', '3011234567', 'jorge.morales@email.com', 'propietario'),
('1012345678', 'Patricia', 'Herrera', '3012345678', 'patricia.herrera@email.com', 'encargado'),
('1013456789', 'Miguel', 'Castro', '3013456789', 'miguel.castro@email.com', 'propietario'),
('1014567890', 'Sandra', 'Ruiz', '3014567890', 'sandra.ruiz@email.com', 'propietario'),
('1015678901', 'Fernando', 'Ortiz', '3015678901', 'fernando.ortiz@email.com', 'fontanero'),
('1016789012', 'Gloria', 'Mendoza', '3016789012', 'gloria.mendoza@email.com', 'propietario');

-- Insertar predios
INSERT INTO predio (matricula, direccion, telefono, email) VALUES
('MAT-2025-001', 'Calle 10 #20-30', '3001234567', 'predio001@email.com'),
('MAT-2025-002', 'Carrera 15 #25-40', '3005678901', 'predio002@email.com'),
('MAT-2025-003', 'Avenida 5 #30-50', '3006789012', 'predio003@email.com'),
('MAT-2025-004', 'Calle 8 #15-25', '3001234567', 'predio004@email.com'),
('MAT-2025-005', 'Carrera 20 #10-15', '3005678901', 'predio005@email.com'),
('MAT-2025-006', 'Calle 20 #15-30', '3007890123', 'predio006@email.com'),
('MAT-2025-007', 'Carrera 8 #22-45', '3008901234', 'predio007@email.com'),
('MAT-2025-008', 'Calle 25 #10-15', '3010123456', 'predio008@email.com'),
('MAT-2025-009', 'Carrera 18 #30-40', '3011234567', 'predio009@email.com'),
('MAT-2025-010', 'Calle 30 #12-20', '3013456789', 'predio010@email.com'),
('MAT-2025-011', 'Carrera 22 #8-18', '3014567890', 'predio011@email.com'),
('MAT-2025-012', 'Calle 35 #20-30', '3016789012', 'predio012@email.com'),
('MAT-2025-013', 'Avenida 10 #5-15', '3007890123', 'predio013@email.com'),
('MAT-2025-014', 'Calle 40 #25-35', '3010123456', 'predio014@email.com'),
('MAT-2025-015', 'Carrera 25 #12-22', '3011234567', 'predio015@email.com');

-- Insertar matrículas (relación entre usuario y predio)
INSERT INTO matricula (numero_matricula, id_predio, cedula_propietario, observaciones) VALUES
('MAT-2025-001', 1, '1001234567', 'Primera matrícula del sistema'),
('MAT-2025-002', 2, '1005678901', 'Matrícula activa'),
('MAT-2025-003', 3, '1006789012', 'Matrícula activa'),
('MAT-2025-004', 4, '1001234567', 'Segunda propiedad del usuario'),
('MAT-2025-005', 5, '1005678901', 'Lote en desarrollo'),
('MAT-2025-006', 6, '1007890123', 'Matrícula regular'),
('MAT-2025-007', 7, '1008901234', 'Matrícula regular'),
('MAT-2025-008', 8, '1010123456', 'Matrícula regular'),
('MAT-2025-009', 9, '1011234567', 'Matrícula regular'),
('MAT-2025-010', 10, '1013456789', 'Matrícula regular'),
('MAT-2025-011', 11, '1014567890', 'Matrícula regular'),
('MAT-2025-012', 12, '1016789012', 'Matrícula regular'),
('MAT-2025-013', 13, '1007890123', 'Segunda propiedad'),
('MAT-2025-014', 14, '1010123456', 'Matrícula regular'),
('MAT-2025-015', 15, '1011234567', 'Matrícula regular');

-- Insertar solicitudes de mantenimiento
INSERT INTO solicitud_mantenimiento (codigo_solicitud, matricula, id_tipo, cedula_solicitante, fecha_solicitud, observaciones, estado, prioridad) VALUES
('SOL-2025-001', 'MAT-2025-001', 1, '1002345678', '2025-01-10 09:00:00', 'Fuga en el baño principal, urgente', 'completado', 'alta'),
('SOL-2025-002', 'MAT-2025-002', 3, '1002345678', '2025-01-12 10:30:00', 'Mantenimiento anual programado', 'completado', 'media'),
('SOL-2025-003', 'MAT-2025-003', 6, '1002345678', '2025-01-15 14:00:00', 'Tubería de la cocina obstruida', 'completado', 'urgente'),
('SOL-2025-004', 'MAT-2025-004', 2, '1002345678', '2025-01-18 09:00:00', 'Instalación de tubería nueva en cocina', 'en_proceso', 'media'),
('SOL-2025-005', 'MAT-2025-006', 4, '1002345678', '2025-01-20 10:30:00', 'Válvula de paso con fuga', 'pendiente', 'alta'),
('SOL-2025-006', 'MAT-2025-007', 5, '1012345678', '2025-01-22 14:00:00', 'Limpieza de tanque elevado', 'pendiente', 'media'),
('SOL-2025-007', 'MAT-2025-008', 1, '1002345678', '2025-01-25 08:15:00', 'Fuga en tubería externa', 'completado', 'urgente'),
('SOL-2025-008', 'MAT-2025-009', 3, '1012345678', '2025-01-28 11:00:00', 'Revisión general del sistema', 'en_proceso', 'baja'),
('SOL-2025-009', 'MAT-2025-011', 1, '1002345678', '2025-02-01 10:00:00', 'Fuga menor en baño', 'pendiente', 'media'),
('SOL-2025-010', 'MAT-2025-012', 2, '1012345678', '2025-02-03 16:00:00', 'Instalación de punto de agua', 'pendiente', 'baja'),
('SOL-2024-015', 'MAT-2025-001', 6, '1002345678', '2024-12-10 15:30:00', 'Destape de tubería principal', 'completado', 'alta'),
('SOL-2024-016', 'MAT-2025-005', 1, '1002345678', '2024-12-15 09:45:00', 'Fuga en medidor', 'completado', 'media'),
('SOL-2024-017', 'MAT-2025-010', 4, '1012345678', '2024-12-20 13:20:00', 'Cambio de válvula principal', 'completado', 'alta'),
('SOL-2024-018', 'MAT-2025-003', 7, '1002345678', '2024-12-22 10:00:00', 'Revisión de medidor con lectura incorrecta', 'completado', 'media'),
('SOL-2024-019', 'MAT-2025-006', 8, '1012345678', '2024-12-28 14:30:00', 'Bomba de agua no funciona', 'completado', 'urgente');

-- Insertar reportes de mantenimiento
INSERT INTO reporte_mantenimiento (codigo_solicitud, cedula_fontanero, fecha_realizacion, descripcion_trabajo, materiales_usados, costo, estado_final, observaciones_finales) VALUES
('SOL-2025-001', '1003456789', '2025-01-11 10:30:00', 'Se reparó fuga en tubería del baño principal. Se cambió sección de tubería PVC de 1/2 pulgada', 'Tubería PVC 1/2" (2m), Codo PVC 90° (2 unidades), Pegante PVC (1 unidad), Lija (1 unidad)', 45000.00, 'completado', 'Trabajo completado satisfactoriamente. Sistema funcionando correctamente'),
('SOL-2025-002', '1004567890', '2025-01-13 14:00:00', 'Mantenimiento preventivo completo. Revisión de todas las conexiones, válvulas y tuberías', 'Teflón (2 rollos), Lubricante para válvulas (1 unidad), Limpiador de tuberías (1 litro)', 35000.00, 'completado', 'Sistema en buen estado. Se recomienda próxima revisión en 6 meses'),
('SOL-2025-003', '1003456789', '2025-01-16 09:00:00', 'Destape de tubería de cocina obstruida. Se utilizó equipo de presión', 'Químico destapador industrial (1 litro), Mano de obra especializada', 55000.00, 'completado', 'Tubería completamente despejada'),
('SOL-2025-007', '1009012345', '2025-01-26 14:00:00', 'Reparación de fuga en tubería externa. Se reemplazó válvula de paso defectuosa', 'Válvula de paso 1/2" (1 unidad), Tubería PVC 1/2" (1m), Teflón (1 rollo), Abrazadera (2 unidades)', 38000.00, 'completado', 'Sistema funcionando correctamente'),
('SOL-2024-015', '1003456789', '2024-12-11 09:00:00', 'Destape de tubería principal obstruida. Se utilizó equipo de presión de alta potencia', 'Químico destapador industrial (2 litros), Mano de obra especializada', 65000.00, 'completado', 'Tubería completamente despejada'),
('SOL-2024-016', '1009012345', '2024-12-16 11:30:00', 'Reparación de fuga en conexión del medidor. Se cambió empaque y se ajustó conexión', 'Empaque de caucho (2 unidades), Teflón (1 rollo)', 25000.00, 'completado', 'Sin fugas después de la reparación'),
('SOL-2024-017', '1004567890', '2024-12-21 15:45:00', 'Cambio de válvula principal defectuosa por nueva válvula de bola', 'Válvula de bola 3/4" (1 unidad), Adaptadores (2 unidades), Teflón (2 rollos)', 62000.00, 'completado', 'Válvula instalada y probada correctamente'),
('SOL-2024-018', '1003456789', '2024-12-23 10:00:00', 'Revisión y calibración de medidor. Se limpió filtro interno', 'Limpieza de filtro, Calibración, Empaque nuevo (1 unidad)', 30000.00, 'completado', 'Medidor funcionando correctamente'),
('SOL-2024-019', '1015678901', '2024-12-29 16:00:00', 'Reparación de bomba de agua. Se cambió motor', 'Motor de bomba 1/2 HP (1 unidad), Cable eléctrico (5m), Conectores (4 unidades)', 180000.00, 'completado', 'Bomba funcionando correctamente');

-- Insertar facturas
INSERT INTO factura (codigo_factura, numero_matricula, cedula_usuario, periodo_facturacion, fecha_emision, fecha_vencimiento, consumo_m3, valor_consumo, valor_mantenimiento, subtotal, total, estado, metodo_pago, fecha_pago) VALUES
('FACT-2025-001', 'MAT-2025-001', '1001234567', '2025-01', '2025-01-01', '2025-01-16', 8.5, 21250.00, 15000.00, 36250.00, 36250.00, 'pagada', 'transferencia', '2025-01-10 14:30:00'),
('FACT-2025-002', 'MAT-2025-002', '1005678901', '2025-01', '2025-01-01', '2025-01-16', 6.2, 15500.00, 15000.00, 30500.00, 30500.00, 'pendiente', NULL, NULL),
('FACT-2025-003', 'MAT-2025-003', '1006789012', '2025-01', '2025-01-01', '2025-01-16', 4.8, 12000.00, 15000.00, 27000.00, 27000.00, 'pendiente', NULL, NULL),
('FACT-2025-004', 'MAT-2025-004', '1001234567', '2025-01', '2025-01-01', '2025-01-16', 5.5, 13750.00, 15000.00, 28750.00, 28750.00, 'pendiente', NULL, NULL),
('FACT-2025-005', 'MAT-2025-005', '1005678901', '2025-01', '2025-01-01', '2025-01-16', 3.2, 8000.00, 15000.00, 23000.00, 23000.00, 'pagada', 'efectivo', '2025-01-08 09:30:00'),
('FACT-2025-006', 'MAT-2025-006', '1007890123', '2025-01', '2025-01-01', '2025-01-16', 7.8, 19500.00, 15000.00, 34500.00, 34500.00, 'pendiente', NULL, NULL),
('FACT-2025-007', 'MAT-2025-007', '1008901234', '2025-01', '2025-01-01', '2025-01-16', 4.5, 11250.00, 15000.00, 26250.00, 26250.00, 'pagada', 'transferencia', '2025-01-14 16:20:00'),
('FACT-2025-008', 'MAT-2025-008', '1010123456', '2025-01', '2025-01-01', '2025-01-16', 6.8, 17000.00, 15000.00, 32000.00, 32000.00, 'vencida', NULL, NULL),
('FACT-2024-012', 'MAT-2025-001', '1001234567', '2024-12', '2024-12-01', '2024-12-16', 7.5, 18750.00, 15000.00, 33750.00, 33750.00, 'pagada', 'efectivo', '2024-12-12 10:15:00'),
('FACT-2024-011', 'MAT-2025-002', '1005678901', '2024-11', '2024-11-01', '2024-11-16', 5.5, 13750.00, 15000.00, 28750.00, 31612.50, 'en_mora', NULL, NULL);

-- Insertar detalles de factura
INSERT INTO detalle_factura (codigo_factura, concepto, cantidad, valor_unitario, valor_total) VALUES
('FACT-2025-001', 'Tarifa básica', 1, 15000.00, 15000.00),
('FACT-2025-001', 'Consumo 8.5 m³', 8.5, 2500.00, 21250.00),
('FACT-2025-002', 'Tarifa básica', 1, 15000.00, 15000.00),
('FACT-2025-002', 'Consumo 6.2 m³', 6.2, 2500.00, 15500.00),
('FACT-2025-003', 'Tarifa básica', 1, 15000.00, 15000.00),
('FACT-2025-003', 'Consumo 4.8 m³', 4.8, 2500.00, 12000.00);

-- Insertar pagos realizados
INSERT INTO pago (codigo_factura, fecha_pago, monto_pagado, metodo_pago, referencia_pago, cedula_quien_paga) VALUES
('FACT-2025-001', '2025-01-10 14:30:00', 36250.00, 'transferencia', 'REF-20250110-001', '1001234567'),
('FACT-2024-012', '2024-12-12 10:15:00', 33750.00, 'efectivo', NULL, '1001234567'),
('FACT-2025-005', '2025-01-08 09:30:00', 23000.00, 'efectivo', NULL, '1005678901'),
('FACT-2025-007', '2025-01-14 16:20:00', 26250.00, 'transferencia', 'REF-20250114-002', '1008901234');
