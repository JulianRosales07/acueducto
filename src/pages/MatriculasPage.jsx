import Buscador from '../components/ComponetesGrupo6/Buscador'
import { useState, useEffect } from 'react';
import { MapPin, Calendar, Home, Search } from "lucide-react";
import { getMatriculas } from '../services/matriculasService'
import CardMatricula from "../components/ComponetesGrupo6/CardMatriculas";
export default function MatriculasPage() {
  // TODO: Cargar matrículas desde la API usando getMatriculas()
  // TODO: Agregar formulario para crear nuevas matrículas
  // TODO: Implementar funciones de editar y eliminar

  const [lista, setLista] = useState([]);
  const [busqueda, setBusqueda] = useState('');



  useEffect(() => {
    const cargar = async () => {
      const datos = await getMatriculas();
      setLista(datos);
    };
    cargar();
  }, []);

  // Filtrar la lista basándose en el término de búsqueda
  const listaFiltrada = lista.filter((m) => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return lista; // Si no hay búsqueda, mostrar todo

    return (
      m.cod_matricula.toLowerCase().includes(termino) ||
      (m.predio?.propietario.cc && m.predio.propietario.cc.toLowerCase().includes(termino))
    );
  });



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Gestión de Matrículas
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Nueva Matrícula
        </button>
      </div>
      <div>

        {/* Compnente con campo de busqueda */}
        <div className="flex flex-row gap-2 w-full mb-4 ">
          <input
            type="text"
            placeholder="Ej: 1234567890 o MAT-2020-1001"
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full h-12 px-4 text-sm text-gray-700 border border-blue-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

        </div>

        {busqueda != '' ? (
          <div className='pb-2'>
            <p className='text-gray-500'>Se encontraron <span className='text-black font-bold'> 2 </span> matricula(s)</p>
          </div>
        ) : (
          <div className='pb-2'>
            <p className='text-gray-500'> Existen <span className='text-black font-bold'> 2 </span> registros de matricula(s)</p>
          </div>
        )}


        {listaFiltrada.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-card p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              No se encontraron matrículas
            </h2>
            <p className="text-muted-foreground">
              No hay matrículas asociadas a la cédula o número ingresado.
            </p>
          </div>
        ) : (
          listaFiltrada.map((m) =>

            <div className="mb-4 bg-white-50 border border-blue-200 rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition">

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-900">{m.cod_matricula}</h2>
                {m.estado == "Activa" ? <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                  {m.estado}
                </span> : <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                  {m.estado}
                </span>}

              </div>

              <div className="space-y-1 text-sm text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className='w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600' />
                  <span>{m.predio.direccion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className='w-4 h-4 text-blue-600' />
                  <span>Creada: {m.fecha}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className='w-4 h-4 text-blue-600' />
                  <span>{m.predio.tipo}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium">Toca para ver detalles completos</p>
            </div>
          )

        )}



      </div>
    </div>
  );
}
