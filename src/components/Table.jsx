import { getEstadoColor } from '../components/ComponetesGrupo6/lib/formatters';
import ModalComponent from './ModalComponent';
import { Search, Plus, Filter, Eye, FileText, Users, TrendingUp, Droplet } from "lucide-react"

export default function Table({ matriculas = [], setOpenModal, setseledtMatricula }) {

    let i = 1;
    return (
        <div className="bg-gray-50 flex items-center justify-center">
            <div className="w-full bg-white border-gray-100 border-2  rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                {["ID", "CODIGO MATRICULA",  "NOMBRE","CEDULA", "PREDIO", "ESTADO", "ACCIONES"].map((title) => (
                                    <th
                                        key={title}
                                        className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {
                                matriculas.length > 0 ? (
                                    matriculas.map((matricula) => (
                                        <tr key={matricula.cod_matricula} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm  font-medium">
                                                {i++}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                                                        <FileText className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-mono text-sm font-medium text-primary">{matricula.cod_matricula}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                {matricula.predio?.propietario?.nombre + " " + matricula.predio?.propietario?.apellido || "Sin datos"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-800">
                                                {matricula.predio?.propietario?.cc || "Sin datos"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {matricula.predio?.direccion || "No registrada"}
                                            </td>
                                            <td
                                                className="px-4 py-3"
                                            >
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${getEstadoColor(matricula.estado)}`}>
                                                    {matricula.estado}
                                                </span>

                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <button
                                                    onClick={() => {
                                                        setOpenModal(true)
                                                        setseledtMatricula(matricula)
                                                    }}
                                                    className="text-blue-600 rounded  font-semibold bg-blue-200  hover:bg-blue-300 px-3 py-1">
                                                    Ver Detalles
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className=" py-4 text-center  text-gray-500">
                                            No se encontraron matriculas para el criterio de búsqueda.
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
