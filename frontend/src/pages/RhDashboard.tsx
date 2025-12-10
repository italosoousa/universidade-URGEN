import React, { useEffect, useState } from "react";
import {
  fetchAllServers,
  fetchPendingEvolutions,
  updateTitrationStatus,
  updateScientificProductionStatus,
  updateEvaluationStatus,
  addMockServer,
  calculateAnnualSalaries,
} from "../services/mockApi";
import { Server, Professor, Funcionario, Titration, ScientificProduction, Evaluation } from "../models";

const RhDashboard: React.FC = () => {
  const [allServers, setAllServers] = useState<Server[]>([]);
  const [pendingTitrations, setPendingTitrations] = useState<Titration[]>([]);
  const [pendingScientificProductions, setPendingScientificProductions] = useState<
    ScientificProduction[]
  >([]);
  const [pendingEvaluations, setPendingEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Server Form States
  const [newServerName, setNewServerName] = useState("");
  const [newServerType, setNewServerType] = useState<"PROFESSOR" | "FUNCIONARIO">("PROFESSOR");
  const [newServerSectorUnit, setNewServerSectorUnit] = useState(""); // sector for Funcionario, unit for Professor
  const [newServerBaseSalary, setNewServerBaseSalary] = useState<number>(0);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const servers = await fetchAllServers();
      setAllServers(servers);

      const pending = await fetchPendingEvolutions();
      setPendingTitrations(pending.pendingTitrations);
      setPendingScientificProductions(pending.pendingScientificProductions);
      setPendingEvaluations(pending.pendingEvaluations);
    } catch (err) {
      setError("Erro ao carregar dados do RH.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveTitration = async (titrationId: string) => {
    await updateTitrationStatus(titrationId, "approved");
    alert("Titulação aprovada!");
    loadData();
  };

  const handleRejectTitration = async (titrationId: string) => {
    await updateTitrationStatus(titrationId, "rejected");
    alert("Titulação rejeitada!");
    loadData();
  };

  const handleApproveScientificProduction = async (productionId: string) => {
    await updateScientificProductionStatus(productionId, "approved");
    alert("Produção científica aprovada!");
    loadData();
  };

  const handleRejectScientificProduction = async (productionId: string) => {
    await updateScientificProductionStatus(productionId, "rejected");
    alert("Produção científica rejeitada!");
    loadData();
  };

  const handleApproveEvaluation = async (evaluationId: string) => {
    await updateEvaluationStatus(evaluationId, "approved");
    alert("Avaliação aprovada!");
    loadData();
  };

  const handleRejectEvaluation = async (evaluationId: string) => {
    await updateEvaluationStatus(evaluationId, "rejected");
    alert("Avaliação rejeitada!");
    loadData();
  };

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newServerType === "PROFESSOR") {
        await addMockServer({
          name: newServerName,
          type: "PROFESSOR",
          unit: newServerSectorUnit,
          baseSalary: newServerBaseSalary,
        });
      } else {
        await addMockServer({
          name: newServerName,
          type: "FUNCIONARIO",
          sector: newServerSectorUnit,
          baseSalary: newServerBaseSalary,
        });
      }
      alert("Servidor adicionado com sucesso!");
      setNewServerName("");
      setNewServerSectorUnit("");
      setNewServerBaseSalary(0);
      loadData();
    } catch (err) {
      alert("Erro ao adicionar servidor.");
    }
  };

  const handleCalculateSalaries = async () => {
    setLoading(true);
    await calculateAnnualSalaries(); // This will internally update mockServers
    alert("Cálculo anual de salários simulado e atualizado!");
    await loadData(); // Reload all data including updated salaries
    setLoading(false);
  };

  if (loading) {
    return <div>Carregando painel do RH...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Painel do RH</h2>

      {/* Cadastro de Servidor */}
      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Cadastro de Servidor</h3>
        <form onSubmit={handleAddServer}>
          <div style={{ marginBottom: "10px" }}>
            <label>Nome: </label>
            <input type="text" value={newServerName} onChange={(e) => setNewServerName(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Tipo: </label>
            <select value={newServerType} onChange={(e) => setNewServerType(e.target.value as "PROFESSOR" | "FUNCIONARIO")} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
              <option value="PROFESSOR">Professor</option>
              <option value="FUNCIONARIO">Funcionário</option>
            </select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>{newServerType === "PROFESSOR" ? "Unidade" : "Setor"}: </label>
            <input type="text" value={newServerSectorUnit} onChange={(e) => setNewServerSectorUnit(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Salário Base: </label>
            <input type="number" value={newServerBaseSalary} onChange={(e) => setNewServerBaseSalary(parseFloat(e.target.value))} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
          </div>
          <button type="submit" style={{ padding: "8px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Adicionar Servidor
          </button>
        </form>
      </div>

      {/* Cálculo Anual de Salários */}
      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Cálculo Anual de Salários</h3>
        <button onClick={handleCalculateSalaries} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Calcular Salários Anuais
        </button>
      </div>

      {/* Evoluções Pendentes */}
      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Evoluções Pendentes de Validação</h3>
        {pendingTitrations.length === 0 &&
        pendingScientificProductions.length === 0 &&
        pendingEvaluations.length === 0 ? (
          <p>Nenhuma evolução pendente.</p>
        ) : (
          <div>
            <h4>Titulações Pendentes</h4>
            {pendingTitrations.length > 0 ? (
              <ul>
                {pendingTitrations.map((t) => (
                  <li key={t.id} style={{ marginBottom: "10px" }}>
                    Professor: {allServers.find(s => s.id === t.professorId)?.name} - {t.type} ({t.conclusionDate})
                    <button onClick={() => handleApproveTitration(t.id)} style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Aprovar
                    </button>
                    <button onClick={() => handleRejectTitration(t.id)} style={{ marginLeft: "5px", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Rejeitar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p>Nenhuma titulação pendente.</p>)}

            <h4>Produções Científicas Pendentes</h4>
            {pendingScientificProductions.length > 0 ? (
              <ul>
                {pendingScientificProductions.map((p) => (
                  <li key={p.id} style={{ marginBottom: "10px" }}>
                    Professor: {allServers.find(s => s.id === p.professorId)?.name} - {p.type}: {p.title} ({p.date})
                    <button onClick={() => handleApproveScientificProduction(p.id)} style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Aprovar
                    </button>
                    <button onClick={() => handleRejectScientificProduction(p.id)} style={{ marginLeft: "5px", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Rejeitar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p>Nenhuma produção científica pendente.</p>)}

            <h4>Avaliações Pendentes</h4>
            {pendingEvaluations.length > 0 ? (
              <ul>
                {pendingEvaluations.map((e) => (
                  <li key={e.id} style={{ marginBottom: "10px" }}>
                    Funcionário: {allServers.find(s => s.id === e.funcionarioId)?.name} - Score: {e.score} ({e.date})
                    <button onClick={() => handleApproveEvaluation(e.id)} style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Aprovar
                    </button>
                    <button onClick={() => handleRejectEvaluation(e.id)} style={{ marginLeft: "5px", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Rejeitar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (<p>Nenhuma avaliação pendente.</p>)}
          </div>
        )}
      </div>

      {/* Visualização Geral de Servidores */}
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Todos os Servidores</h3>
        {allServers.length === 0 ? (
          <p>Nenhum servidor cadastrado.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nome</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Tipo</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Setor/Unidade</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Salário Atual</th>
              </tr>
            </thead>
            <tbody>
              {allServers.map((server) => (
                <tr key={server.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{server.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{server.type}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {server.type === "PROFESSOR" ? (server as Professor).unit : (server as Funcionario).sector}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>R$ {server.currentSalary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RhDashboard;
