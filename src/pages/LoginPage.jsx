import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { Mail, Lock, Droplets } from "lucide-react";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [cedula, setCedula] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(correo, cedula);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel Izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo y Título */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Droplets className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                INICIAR SESIÓN
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-15">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-cyan-50 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition text-gray-700 placeholder-gray-400"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            {/* Campo Cédula */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Cédula
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-cyan-50 border border-cyan-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition text-gray-700 placeholder-gray-400"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "INICIAR SESIÓN"
              )}
            </button>
          </form>

          {/* Nota informativa */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Usa tu correo registrado y tu cédula como contraseña
            </p>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Imagen de fondo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')`,
          }}
        >
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/80 via-blue-600/80 to-blue-800/90" />
          
          {/* Contenido sobre la imagen */}
          <div className="relative h-full flex flex-col items-center justify-center text-white p-12">
            <div className="max-w-lg text-center">
              <Droplets className="w-20 h-20 mx-auto mb-6 drop-shadow-2xl" />
              <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">
                Sistema de Acueducto
              </h2>
              <p className="text-xl text-cyan-50 drop-shadow-md leading-relaxed">
                Gestión integral del servicio de agua potable
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="text-sm font-medium">Facturas</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="text-sm font-medium">Predios</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <p className="text-sm font-medium">Reportes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
