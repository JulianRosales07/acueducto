-- Verificar datos en la base de datos
USE mantenimiento_fontaneria;

-- Verificar tablas
SHOW TABLES;

-- Contar registros
SELECT 'Usuarios' as Tabla, COUNT(*) as Total FROM usuario
UNION ALL
SELECT 'Predios', COUNT(*) FROM predio
UNION ALL
SELECT 'Matrículas', COUNT(*) FROM matricula
UNION ALL
SELECT 'Solicitudes', COUNT(*) FROM solicitud_mantenimiento
UNION ALL
SELECT 'Reportes', COUNT(*) FROM reporte_mantenimiento
UNION ALL
SELECT 'Facturas', COUNT(*) FROM factura;

-- Ver solicitudes
SELECT * FROM solicitud_mantenimiento;

-- Ver si hay problemas con las relaciones
SELECT 
    s.codigo_solicitud,
    s.numero_matricula,
    m.numero_matricula as matricula_existe,
    m.id_predio,
    p.id_predio as predio_existe
FROM solicitud_mantenimiento s
LEFT JOIN matricula m ON s.numero_matricula = m.numero_matricula
LEFT JOIN predio p ON m.id_predio = p.id_predio;
