import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAllServers, addEvaluation } from "../services/mockApi";
import { Funcionario, Evaluation } from "../models";

const ChefiaDashboard: React.FC = () => {
  const { user } = useAuth();
  const [subordinates, setSubordinates] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | null>(null);
  const [newEvaluationScore, setNewEvaluationScore] = useState<number>(0);
  const [newEvaluationComments, setNewEvaluationComments] = useState("");
  const [newEvaluationDate, setNewEvaluationDate] = useState("");

  const loadSubordinates = async () => {
    setLoading(true);
    setError(null);
    try {
      const allServers = await fetchAllServers();
      // For demonstration, let's assume 'chefia1' (serverId 's3') manages 'funcionario1' (s2) and 'funcionario2' (s5)
      // In a real system, this would come from a backend relationship
      const managedFuncionarioIds = ["s2", "s5"];
      const filteredSubordinates = allServers.filter(
        (server) => server.type === "FUNCIONARIO" && managedFuncionarioIds.includes(server.id)
      ) as Funcionario[];
      setSubordinates(filteredSubordinates);
    } catch (err) {
      setError("Erro ao carregar subordinados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubordinates();
  }, [user]);

  const handleAddEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFuncionarioId || !user?.serverId) return; // user.serverId is chefiaId

    try {
      await addEvaluation({
        funcionarioId: selectedFuncionarioId,
        chefiaId: user.serverId,
        score: newEvaluationScore,
        comments: newEvaluationComments,
        date: newEvaluationDate,
      });
      alert("Avaliação registrada com sucesso!");
      setNewEvaluationScore(0);
      setNewEvaluationComments("");
      setNewEvaluationDate("");
      setSelectedFuncionarioId(null); // Reset form
      loadSubordinates(); // Reload data
    } catch (err) {
      alert("Erro ao registrar avaliação.");
    }
  };

  if (loading) {
    return <div>Carregando painel da Chefia...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Painel da Chefia - {user?.username}</h2>

      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Meus Subordinados</h3>
        {subordinates.length === 0 ? (
          <p>Nenhum subordinado encontrado.</p>
        ) : (
          <div>
            {subordinates.map((funcionario) => (
              <div key={funcionario.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #eee", borderRadius: "4px" }}>
                <h4>{funcionario.name}</h4>
                <p><strong>Setor:</strong> {funcionario.sector}</p>
                <p><strong>Salário Atual:</strong> R$ {funcionario.currentSalary.toFixed(2)}</p>

                <h5>Histórico de Avaliações</h5>
                {funcionario.evaluations.length === 0 ? (
                  <p>Nenhuma avaliação registrada.</p>
                ) : (
                  <ul>
                    {funcionario.evaluations.map((evalItem) => (
                      <li key={evalItem.id}>
                        Nota: {evalItem.score} ({evalItem.date}) - "{evalItem.comments}" (Status: {evalItem.status})
                      </li>
                    ))}
                  </ul>
                )}

                <h5>Registrar Nova Avaliação para {funcionario.name}</h5>
                <form onSubmit={handleAddEvaluation}>
                  <input type="hidden" value={funcionario.id} />
                  <div style={{ marginBottom: "10px" }}>
                    <label>Nota (0-10): </label>
                    <input type="number" min="0" max="10" value={selectedFuncionarioId === funcionario.id ? newEvaluationScore : 0} onChange={(e) => { setSelectedFuncionarioId(funcionario.id); setNewEvaluationScore(parseInt(e.target.value)); }} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Comentários: </label>
                    <textarea value={selectedFuncionarioId === funcionario.id ? newEvaluationComments : ""} onChange={(e) => { setSelectedFuncionarioId(funcionario.id); setNewEvaluationComments(e.target.value); }} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}></textarea>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label>Data: </label>
                    <input type="date" value={selectedFuncionarioId === funcionario.id ? newEvaluationDate : ""} onChange={(e) => { setSelectedFuncionarioId(funcionario.id); setNewEvaluationDate(e.target.value); }} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
                  </div>
                  <button type="submit" style={{ padding: "8px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Registrar Avaliação
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefiaDashboard;
