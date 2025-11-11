/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMatriculas } from "../services/matriculasService";
import { ArrowLeft, MapPin, Calendar, Home, User, AlertTriangle } from "lucide-react";


// Sombra mínima para un efecto sutil
const SkeletonLoader = () => (
  <div className="p-6 bg-white rounded-xl shadow-md animate-pulse border border-blue-100"> 
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/5 mb-6"></div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
      <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const DetailItem = ({ Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"> 
    <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || "No especificado"}</p>
    </div>
  </div>
);

// --- Componente Principal ---

export default function DetalleMatriculaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [matricula, setMatricula] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMatricula = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const datos = await getMatriculas(); 
        const encontrada = datos.find((m) => m.cod_matricula === id);
        
        if (!encontrada) {
            setError(`No se encontró la matrícula con código: ${id}`);
        }
        setMatricula(encontrada);
      } catch (err) {
        console.error("Error al cargar la matrícula:", err);
        setError("Ocurrió un error al intentar cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };
    cargarMatricula();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Detalle de Matrícula</h1>
        <SkeletonLoader />
      </div>
    );
  }

  if (error || !matricula) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <button
          onClick={() => navigate("/matriculas")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
          <AlertTriangle className="w-6 h-6" />
          <p className="font-medium">{error || "No se pudo cargar la matrícula."}</p>
        </div>
      </div>
    );
  }
  
  const getEstadoStyle = (estado) => {
    return estado === "Activa"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Botón Volver */}
      <button
        onClick={() => navigate("/matriculas")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>

      {/* Tarjeta Principal de Detalle: Se cambió shadow-2xl por shadow-lg */}
      <div className="bg-white rounded-xl **shadow-lg** p-8 border-t-4 border-blue-600"> 
        
        {/* Encabezado */}
        <header className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Detalle de Matrícula
            </h1>
            <span
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border-2 ${getEstadoStyle(matricula.estado)}`}
            >
              {matricula.estado}
            </span>
        </header>

        {/* Sección de Metadatos */}
        <section className="mb-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
                Información General 🏷️
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DetailItem 
                    Icon={Calendar} 
                    label="Fecha de Creación" 
                    value={matricula.fecha} 
                />
                <DetailItem 
                    Icon={MapPin} 
                    label="Código de Matrícula" 
                    value={matricula.cod_matricula} 
                />
            </div>
        </section>

        {/* Sección del Predio y Propietario */}
        <section>
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Detalles del Predio y Propietario 🏡
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem 
                Icon={MapPin} 
                label="Dirección" 
                value={matricula.predio?.direccion} 
            />
            <DetailItem 
                Icon={Home} 
                label="Tipo de Predio" 
                value={matricula.predio?.tipo} 
            />
            <DetailItem 
                Icon={User} 
                label="Propietario" 
                value={matricula.predio?.propietario?.nombre} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}