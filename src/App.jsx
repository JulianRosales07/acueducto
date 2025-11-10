import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./services/authService";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrediosPage from "./pages/PrediosPage";
import UsuariosPage from "./pages/UsuariosPage";
import PropietariosPage from "./pages/PropietariosPage";
import MatriculasPage from "./pages/MatriculasPage";
import MantenimientosPage from "./pages/MantenimientosPage";
import SolicitudesPage from "./pages/SolicitudesPage";
import ReportesPage from "./pages/ReportesPage";
import FacturasPage from "./pages/FacturasPage";
import PagosPage from "./pages/PagosPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública de login */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/predios" element={<PrediosPage />} />
                      <Route path="/usuarios" element={<UsuariosPage />} />
                      <Route path="/propietarios" element={<PropietariosPage />} />
                      <Route path="/matriculas" element={<MatriculasPage />} />
                      <Route path="/mantenimientos" element={<MantenimientosPage />} />
                      <Route path="/solicitudes" element={<SolicitudesPage />} />
                      <Route path="/reportes" element={<ReportesPage />} />
                      <Route path="/facturas" element={<FacturasPage />} />
                      <Route path="/pagos" element={<PagosPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
