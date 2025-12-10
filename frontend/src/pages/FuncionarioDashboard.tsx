import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchServerById } from "../services/mockApi";
import { Funcionario, FunctionPerformed, Evaluation, EvolutionEvent } from "../models";

const FuncionarioDashboard: React.FC = () => {
  const { user } = useAuth();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFuncionarioData = async () => {
    setLoading(true);
    setError(null);
    if (user?.serverId) {
      const data = await fetchServerById(user.serverId);
      if (data && data.type === "FUNCIONARIO") {
        setFuncionario(data as Funcionario);
      } else {
        setError("Dados do funcionário não encontrados ou tipo incorreto.");
      }
    } else {
      setError("ID do servidor do usuário não encontrado.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFuncionarioData();
  }, [user]);

  if (loading) {
    return <div>Carregando painel do funcionário...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  if (!funcionario) {
    return <div>Nenhum dado de funcionário disponível.</div>;
  }

  // Determine current role
  const currentRole = funcionario.functionsPerformed.find(f => !f.endDate);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Painel do Funcionário - {funcionario.name}</h2>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Matrícula:</strong> {funcionario.id}</p>
        <p><strong>Setor:</strong> {funcionario.sector}</p>
        <p><strong>Função Atual:</strong> {currentRole ? currentRole.role : "N/A"}</p>
        <p><strong>Salário Base:</strong> R$ {funcionario.baseSalary.toFixed(2)}</p>
        <p><strong>Salário Atual:</strong> R$ {funcionario.currentSalary.toFixed(2)}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        {/* Funções Exercidas */}
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <h3>Funções Exercidas</h3>
          {funcionario.functionsPerformed.length === 0 ? (
            <p>Nenhuma função registrada.</p>
          ) : (
            <ul>
              {funcionario.functionsPerformed.map((f) => (
                <li key={f.id}>
                  {f.role} ({f.startDate} {f.endDate ? `- ${f.endDate}` : "- Atualmente"})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Avaliações de Desempenho */}
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <h3>Avaliações de Desempenho</h3>
          {funcionario.evaluations.length === 0 ? (
            <p>Nenhuma avaliação registrada.</p>
          ) : (
            <ul>
              {funcionario.evaluations.map((e) => (
                <li key={e.id}>
                  Nota: {e.score} - {e.date} (Status: {e.status})
                  <p style={{ margin: "5px 0 0 15px", fontSize: "0.9em", color: "#555" }}>
                    "{e.comments}"
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Histórico de Evolução */}
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
        <h3>Histórico de Evolução</h3>
        {funcionario.evolutionHistory.length === 0 ? (
          <p>Nenhum evento de evolução registrado.</p>
        ) : (
          <ul>
            {funcionario.evolutionHistory.map((event: EvolutionEvent, index: number) => (
              <li key={index}>
                <strong>{event.type}</strong>: {event.description} ({event.date}) - Status: {event.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FuncionarioDashboard;
