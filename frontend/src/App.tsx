import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css"; // Assuming basic styling

// Placeholder Components for Dashboards
import ProfessorDashboard from "./pages/ProfessorDashboard";
import FuncionarioDashboard from "./pages/FuncionarioDashboard";
import RhDashboard from "./pages/RhDashboard";
import ChefiaDashboard from "./pages/ChefiaDashboard";
import ReitorDashboard from "./pages/ReitorDashboard";

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{ padding: "1rem", backgroundColor: "#007bff", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1>URGEN - Sistema de Gestão de Carreira</h1>
      {isAuthenticated && user && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: "1rem" }}>Olá, {user.username} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

function App() {
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        switch (role) {
          case "PROFESSOR":
            navigate("/professor");
            break;
          case "FUNCIONARIO":
            navigate("/funcionario");
            break;
          case "RH":
            navigate("/rh");
            break;
          case "CHEFIA":
            navigate("/chefia");
            break;
          case "REITOR":
            navigate("/reitor");
            break;
          default:
            navigate("/"); // Fallback for any unknown role
            break;
        }
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, role, loading, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <h1>Carregando autenticação...</h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute allowedRoles={["PROFESSOR"]} />}>
            <Route path="/professor" element={<ProfessorDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["FUNCIONARIO"]} />}>
            <Route path="/funcionario" element={<FuncionarioDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["RH"]} />}>
            <Route path="/rh" element={<RhDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["CHEFIA"]} />}>
            <Route path="/chefia" element={<ChefiaDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["REITOR"]} />}>
            <Route path="/reitor" element={<ReitorDashboard />} />
          </Route>

          {/* Fallback for authenticated users without specific role route or unhandled paths */}
          <Route
            path="*"
            element={isAuthenticated ? <h2>Bem-vindo! Escolha uma opção no menu.</h2> : <LoginPage />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;