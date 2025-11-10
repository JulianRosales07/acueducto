import { useState, useEffect } from "react";
import { Search, CheckCircle, FileText, ClipboardList, Download } from "lucide-react";
import { getSolicitudes, updateSolicitudEstado } from "../services/solicitudesService";

export default function ReportesPage() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [reportesCompletados, setReportesCompletados] = useState([]);
    const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
    const [filteredReportes, setFilteredReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSolicitud, setSelectedSolicitud] = useState(null);
    const [showReporteForm, setShowReporteForm] = useState(false);
    const [activeTab, setActiveTab] = useState("pendientes");
    const [reporteData, setReporteData] = useState({
        descripcion_trabajo: "",
        fecha_ejecucion: new Date().toISOString().split("T")[0],
    });

    useEffect(() => {
        loadSolicitudes();
    }, []);

    useEffect(() => {
        filterSolicitudes();
    }, [searchTerm, solicitudes]);

    const loadSolicitudes = async () => {
        try {
            setLoading(true);
            const data = await getSolicitudes();
            const pendientes = data.filter(s => s.estado !== "Completado" && s.estado !== "Cancelado");
            const completados = data.filter(s => s.estado === "Completado");
            setSolicitudes(pendientes);
            setReportesCompletados(completados);
            setFilteredSolicitudes(pendientes);
            setFilteredReportes(completados);
            setError(null);
        } catch (err) {
            setError("Error al cargar solicitudes: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterSolicitudes = () => {
        if (!searchTerm.trim()) {
            setFilteredSolicitudes(solicitudes);
            setFilteredReportes(reportesCompletados);
            return;
        }

        const term = searchTerm.toLowerCase();
        
        const filteredPendientes = solicitudes.filter((s) => {
            const propietario = s.predio?.propietario;
            return (
                s.id?.toString().includes(term) ||
                s.cod_matricula?.toLowerCase().includes(term) ||
                s.predio?.direccion?.toLowerCase().includes(term) ||
                s.mantenimiento?.nombre?.toLowerCase().includes(term) ||
                propietario?.cc?.toLowerCase().includes(term) ||
                propietario?.nombre?.toLowerCase().includes(term) ||
                propietario?.apellido?.toLowerCase().includes(term)
            );
        });
        
        const filteredCompletados = reportesCompletados.filter((s) => {
            const propietario = s.predio?.propietario;
            return (
                s.id?.toString().includes(term) ||
                s.cod_matricula?.toLowerCase().includes(term) ||
                s.predio?.direccion?.toLowerCase().includes(term) ||
                s.mantenimiento?.nombre?.toLowerCase().includes(term) ||
                propietario?.cc?.toLowerCase().includes(term) ||
                propietario?.nombre?.toLowerCase().includes(term) ||
                propietario?.apellido?.toLowerCase().includes(term)
            );
        });
        
        setFilteredSolicitudes(filteredPendientes);
        setFilteredReportes(filteredCompletados);
    };

    const handleSelectSolicitud = (solicitud) => {
        setSelectedSolicitud(solicitud);
        setShowReporteForm(true);
        setReporteData({
            descripcion_trabajo: "",
            fecha_ejecucion: new Date().toISOString().split("T")[0],
        });
    };

    const handleSubmitReporte = async (e) => {
        e.preventDefault();
        try {
            await updateSolicitudEstado(selectedSolicitud.id, "Completado");
            await loadSolicitudes();
            setShowReporteForm(false);
            setSelectedSolicitud(null);
            setReporteData({
                descripcion_trabajo: "",
                fecha_ejecucion: new Date().toISOString().split("T")[0],
            });
            alert("Reporte registrado exitosamente");
        } catch (err) {
            setError("Error al registrar reporte: " + err.message);
        }
    };

    const cancelReporte = () => {
        setShowReporteForm(false);
        setSelectedSolicitud(null);
        setReporteData({
            descripcion_trabajo: "",
            fecha_ejecucion: new Date().toISOString().split("T")[0],
        });
    };

    const descargarTicket = (reporte) => {
        // Crear contenido HTML para el ticket
        const ticketHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Ticket de Reporte - ${reporte.id}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #2563eb;
                        margin: 0;
                        font-size: 28px;
                    }
                    .header p {
                        color: #666;
                        margin: 5px 0 0 0;
                    }
                    .section {
                        margin-bottom: 25px;
                        padding: 15px;
                        background-color: #f8fafc;
                        border-radius: 8px;
                        border-left: 4px solid #2563eb;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #2563eb;
                        margin-bottom: 15px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #666;
                        font-size: 12px;
                        text-transform: uppercase;
                        margin-bottom: 3px;
                    }
                    .info-value {
                        color: #333;
                        font-size: 16px;
                    }
                    .badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 600;
                    }
                    .badge-completado {
                        background-color: #dcfce7;
                        color: #166534;
                    }
                    .badge-urgente {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    .badge-alta {
                        background-color: #fed7aa;
                        color: #9a3412;
                    }
                    .badge-media {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }
                    .badge-baja {
                        background-color: #f3f4f6;
                        color: #374151;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #e5e7eb;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                    .full-width {
                        grid-column: 1 / -1;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>TICKET DE REPORTE DE MANTENIMIENTO</h1>
                    <p>Sistema Acueducto</p>
                </div>

                <div class="section">
                    <div class="section-title">Información General</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Código de Solicitud</div>
                            <div class="info-value">#${reporte.id}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Matrícula</div>
                            <div class="info-value">${reporte.cod_matricula || "N/A"}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Estado</div>
                            <div class="info-value">
                                <span class="badge badge-completado">${reporte.estado}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Fecha de Solicitud</div>
                            <div class="info-value">${reporte.fecha_solicitud ? new Date(reporte.fecha_solicitud).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Datos del Predio</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Dirección</div>
                            <div class="info-value">${reporte.predio?.direccion || "N/A"}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Propietario</div>
                            <div class="info-value">${reporte.predio?.propietario ? `${reporte.predio.propietario.nombre} ${reporte.predio.propietario.apellido}` : "N/A"}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Cédula</div>
                            <div class="info-value">${reporte.predio?.propietario?.cc || "N/A"}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Teléfono</div>
                            <div class="info-value">${reporte.predio?.propietario?.telefono || "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Detalles del Mantenimiento</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Tipo de Mantenimiento</div>
                            <div class="info-value">${reporte.mantenimiento?.nombre || "N/A"}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Prioridad</div>
                            <div class="info-value">
                                <span class="badge badge-${reporte.prioridad?.toLowerCase()}">${reporte.prioridad}</span>
                            </div>
                        </div>
                        ${reporte.observaciones ? `
                        <div class="info-item full-width">
                            <div class="info-label">Observaciones Iniciales</div>
                            <div class="info-value">${reporte.observaciones}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="footer">
                    <p>Documento generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <p>Sistema de Gestión de Acueducto</p>
                </div>
            </body>
            </html>
        `;

        // Crear un blob y descargarlo
        const blob = new Blob([ticketHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ticket_Reporte_${reporte.id}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <p className="text-gray-600">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">
                    Reporte de Mantenimiento
                </h1>
                <p className="text-gray-600">
                    Busca y registra el reporte de mantenimientos realizados
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!showReporteForm ? (
                <>
                    <div className="mb-6 flex gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("pendientes")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                activeTab === "pendientes"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <FileText size={18} />
                                Solicitudes Pendientes ({filteredSolicitudes.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("completados")}
                            className={`px-6 py-3 font-medium transition-colors ${
                                activeTab === "completados"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <ClipboardList size={18} />
                                Reportes Registrados ({filteredReportes.length})
                            </div>
                        </button>
                    </div>

                    {activeTab === "pendientes" ? (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-700">Código</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Matrícula</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Predio</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Tipo Mantenimiento</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Prioridad</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Estado</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSolicitudes.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-600">
                                                {searchTerm ? "No se encontraron solicitudes" : "No hay solicitudes pendientes"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSolicitudes.map((s) => (
                                            <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900 font-medium">{s.id}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.cod_matricula || "N/A"}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.predio?.direccion || "N/A"}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.mantenimiento?.nombre || "N/A"}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${s.prioridad === "Urgente"
                                                            ? "bg-red-100 text-red-800"
                                                            : s.prioridad === "Alta"
                                                                ? "bg-orange-100 text-orange-800"
                                                                : s.prioridad === "Media"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {s.prioridad}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                                        {s.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleSelectSolicitud(s)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <FileText size={16} />
                                                        Registrar Reporte
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-700">Código</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Matrícula</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Predio</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Tipo Mantenimiento</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Prioridad</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Fecha Solicitud</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Estado</th>
                                        <th className="px-4 py-3 text-left text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReportes.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-gray-600">
                                                {searchTerm ? "No se encontraron reportes" : "No hay reportes registrados"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReportes.map((s) => (
                                            <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900 font-medium">{s.id}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.cod_matricula || "N/A"}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.predio?.direccion || "N/A"}</td>
                                                <td className="px-4 py-3 text-gray-900">{s.mantenimiento?.nombre || "N/A"}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs ${s.prioridad === "Urgente"
                                                            ? "bg-red-100 text-red-800"
                                                            : s.prioridad === "Alta"
                                                                ? "bg-orange-100 text-orange-800"
                                                                : s.prioridad === "Media"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {s.prioridad}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-900">
                                                    {s.fecha_solicitud ? new Date(s.fecha_solicitud).toLocaleDateString('es-ES') : "N/A"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                                                        {s.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => descargarTicket(s)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                                                        title="Descargar ticket del reporte"
                                                    >
                                                        <Download size={16} />
                                                        Descargar Ticket
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <FileText size={24} className="text-blue-600" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Registrar Reporte de Mantenimiento
                        </h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Datos de la Solicitud</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Código de Solicitud</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Matrícula</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.cod_matricula}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Predio</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.predio?.direccion || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tipo de Mantenimiento</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.mantenimiento?.nombre || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Prioridad</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.prioridad}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Observaciones</p>
                                <p className="font-medium text-gray-900">{selectedSolicitud.observaciones || "Sin observaciones"}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitReporte} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                                Descripción del Trabajo Realizado *
                            </label>
                            <textarea
                                value={reporteData.descripcion_trabajo}
                                onChange={(e) =>
                                    setReporteData({ ...reporteData, descripcion_trabajo: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="5"
                                placeholder="Describe detalladamente el trabajo realizado..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2 font-medium">
                                Fecha de Ejecución *
                            </label>
                            <input
                                type="date"
                                value={reporteData.fecha_ejecucion}
                                onChange={(e) =>
                                    setReporteData({ ...reporteData, fecha_ejecucion: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
                            >
                                <CheckCircle size={20} />
                                Completar Mantenimiento
                            </button>
                            <button
                                type="button"
                                onClick={cancelReporte}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2.5 rounded-lg transition font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
