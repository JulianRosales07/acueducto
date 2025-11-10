import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

const menuSections = [
  {
    title: "PRINCIPAL",
    items: [
      { path: "/", label: "Dashboard", icon: "🏠" },
      { path: "/predios", label: "Predios", icon: "🏘" },
      { path: "/matriculas", label: "Matriculas", icon: "📋" },
      { path: "/usuarios", label: "Usuarios", icon: "👥" },
      { path: "/propietarios", label: "Propietarios", icon: "👤" },
    ],
  },
  {
    title: "MANTENIMIENTO",
    items: [
      { path: "/mantenimientos", label: "Tipos", icon: "🔧" },
      { path: "/solicitudes", label: "Solicitudes", icon: "📝" },
      { path: "/reportes", label: "Reportes", icon: "📊" },
    ],
  },
  {
    title: "FACTURACION",
    items: [
      { path: "/facturas", label: "Facturas", icon: "💰" },
      { path: "/pagos", label: "Pagos", icon: "💳" },
    ],
  },
];

const sidebarIcons = [
  { icon: "🏠", path: "/", label: "Dashboard" },
  { icon: "🏘", path: "/predios", label: "Predios" },
  { icon: "📋", path: "/matriculas", label: "Matriculas" },
  { icon: "👥", path: "/usuarios", label: "Usuarios" },
  { icon: "👤", path: "/propietarios", label: "Propietarios" },
];

const bottomIcons = [
  { icon: "🔧", path: "/mantenimientos", label: "Mantenimientos" },
  { icon: "📝", path: "/solicitudes", label: "Solicitudes" },
  { icon: "📊", path: "/reportes", label: "Reportes" },
  { icon: "💰", path: "/facturas", label: "Facturas" },
  { icon: "💳", path: "/pagos", label: "Pagos" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen relative">
      <div className="w-20 bg-gray-900 flex flex-col items-center py-4 relative">
        <Link to="/" className="w-14 h-14 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition mb-4">
          <span className="text-2xl">💧</span>
        </Link>

        {!isExpanded && (
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-white transition mb-4"
          >
            →
          </button>
        )}

        <div className="flex-1 flex flex-col items-center space-y-2 pt-2">
          {sidebarIcons.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition flex-shrink-0 ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col items-center space-y-2 pt-2 pb-2">
          {bottomIcons.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition flex-shrink-0 ${
                  isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isExpanded ? "w-72" : "w-0"} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sistema Acueducto</h2>
              <p className="text-sm text-gray-500">Gestion Integral</p>
            </div>
            <button onClick={toggleSidebar} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
              ←
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {user && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.correo}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="inline-block bg-gray-900 text-white px-3 py-1 rounded text-xs font-medium">
                Administrador
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition border border-gray-200"
            >
              <span>↪</span>
              <span className="text-sm font-medium">Cerrar Sesion</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
