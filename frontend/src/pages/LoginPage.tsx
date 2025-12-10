import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(username, password);
    if (success) {
      // Login successful, AuthContext will handle user and role.
      // Redirect will happen in App.tsx based on role.
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          padding: "40px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "24px", color: "#333" }}>Login URGEN</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "calc(100% - 20px)",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "calc(100% - 20px)",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              required
            />
          </div>
          {error && <p style={{ color: "red", marginBottom: "16px" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
