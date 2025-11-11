import Buscador from '../components/ComponetesGrupo6/Buscador'

import Card from '../components/Card';

import Table from '../components/Table';
/* import Button from "../components/Button"; */
import { useState, useEffect } from 'react';
import { getMatriculas } from '../services/matriculasService';
import { listaFiltrada } from '../components/ComponetesGrupo6/lib/formatters';
import ModalComponent from '../components/ModalComponent';
import { Button } from 'flowbite-react';
import { Search, Plus, Filter, Eye, FileText, Users, TrendingUp, Droplet, Car } from "lucide-react"




export default function MatriculasPage() {

  const [listaMatriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criterio, setCriterio] = useState('');
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [seledtMatricula, setseledtMatricula] = useState({});

  const cargar = async () => {
    try {
      setLoading(true)
      setError('');
      if (!navigator.onLine) {
        throw new Error('offline');
      }
      const datos = await getMatriculas();
      setMatriculas(datos || []);
    } catch (error) {
      console.log('Error al cargar matricuas: ', error);
      if (error.message === 'offline') {
        setError('No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.');
      } else {
        setError('Error al cargar las matrículas. Por favor, intenta de nuevo más tarde.');
      }
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    cargar();
  }, []);



  return (
    <>
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 mb-">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Droplet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-balance bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Gestión de Matrículas
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">Sistema Acueducto - Control y Administración</p>
              </div>
            </div>
            <Button
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Plus className="h-5 w-5" />
              Nueva Matrícula
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 min-h-screen">
      
        <Card >

          <h1 className="text-3xl font-bold">Buscar Matriculas</h1>
          <p className='text-gray-400'>Encuentra matrículas por código, cédula, propietario o dirección del predio</p>
          <Buscador placeholder="Buscar Ej. MAT-2025-0001 o 1234567890" onChange={(e) => setCriterio(e.target.value)} />
        </Card>

        <Card  >
          <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
            <h1 className="text-xl leading-none font-semibold">Registro de Matrículas</h1>
            <p className='text-muted-foreground text-sm'>
              {listaMatriculas.length} matrículas registradas en el sistema
            </p>
          </div>
          {/* 🔄 Spinner mientras carga */}
          {
            loading && (
              <div className="p-6 bg-gray-50 min-h-screen flex  justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando Matriculas...</p>
                </div>
              </div>
            )
          }

          {/* ⚠️ Mensaje de error si no hay conexión */}
          {!loading && error && (
            <div className="flex justify-center bg-red-100 text-red-700 border border-red-400 rounded-lg p-4 mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && (<Table matriculas={listaFiltrada(criterio, listaMatriculas)} setOpenModal={setOpenModal} setseledtMatricula={setseledtMatricula} />)}
          <ModalComponent openModal={openModal} setOpenModal={setOpenModal} matricula={seledtMatricula} />
        </Card>
      </div>
    </>

  );
}
