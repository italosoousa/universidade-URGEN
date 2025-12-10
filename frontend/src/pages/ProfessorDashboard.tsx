import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchServerById, addTitration, addScientificProduction } from "../services/mockApi";
import { Professor, Titration, ScientificProduction, EvolutionEvent } from "../models";

const ProfessorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [newTitrationType, setNewTitrationType] = useState<Titration["type"]>("Especialização");
  const [newTitrationDate, setNewTitrationDate] = useState("");
  const [newProdType, setNewProdType] = useState<ScientificProduction["type"]>("Livro");
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdDate, setNewProdDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfessorData = async () => {
    setLoading(true);
    setError(null);
    if (user?.serverId) {
      const data = await fetchServerById(user.serverId);
      if (data && data.type === "PROFESSOR") {
        setProfessor(data as Professor);
      } else {
        setError("Dados do professor não encontrados ou tipo incorreto.");
      }
    } else {
      setError("ID do servidor do usuário não encontrado.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfessorData();
  }, [user]);

  const handleAddTitration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professor) return;
    try {
      await addTitration({
        professorId: professor.id,
        type: newTitrationType,
        conclusionDate: newTitrationDate,
      });
      setNewTitrationDate("");
      // Reload data to reflect the new titration
      await loadProfessorData();
      alert("Titulação registrada com sucesso!");
    } catch (err) {
      alert("Erro ao registrar titulação.");
    }
  };

  const handleAddScientificProduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professor) return;
    try {
      await addScientificProduction({
        professorId: professor.id,
        type: newProdType,
        title: newProdTitle,
        date: newProdDate,
      });
      setNewProdTitle("");
      setNewProdDate("");
      // Reload data to reflect the new production
      await loadProfessorData();
      alert("Produção científica registrada com sucesso!");
    } catch (err) {
      alert("Erro ao registrar produção científica.");
    }
  };

  if (loading) {
    return <div>Carregando painel do professor...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  if (!professor) {
    return <div>Nenhum dado de professor disponível.</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Painel do Professor - {professor.name}</h2>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Matrícula:</strong> {professor.id}</p>
        <p><strong>Unidade:</strong> {professor.unit}</p>
        <p><strong>Salário Base:</strong> R$ {professor.baseSalary.toFixed(2)}</p>
        <p><strong>Salário Atual:</strong> R$ {professor.currentSalary.toFixed(2)}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        {/* Titulações */}
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <h3>Minhas Titulações</h3>
          {professor.titrations.length === 0 ? (
            <p>Nenhuma titulação registrada.</p>
          ) : (
            <ul>
              {professor.titrations.map((t) => (
                <li key={t.id}>
                  {t.type} - {t.conclusionDate} (Status: {t.status})
                </li>
              ))}
            </ul>
          )}
          <h4>Registrar Nova Titulação</h4>
          <form onSubmit={handleAddTitration}>
            <div style={{ marginBottom: "10px" }}>
              <label>Tipo: </label>
              <select value={newTitrationType} onChange={(e) => setNewTitrationType(e.target.value as Titration["type"])} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
                <option value="Especialização">Especialização</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Doutorado">Doutorado</option>
                <option value="Pós-Doutorado">Pós-Doutorado</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Data de Conclusão: </label>
              <input type="date" value={newTitrationDate} onChange={(e) => setNewTitrationDate(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
            </div>
            <button type="submit" style={{ padding: "8px 15px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Registrar Titulação
            </button>
          </form>
        </div>

        {/* Produções Científicas */}
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <h3>Minhas Produções Científicas</h3>
          {professor.scientificProductions.length === 0 ? (
            <p>Nenhuma produção científica registrada.</p>
          ) : (
            <ul>
              {professor.scientificProductions.map((p) => (
                <li key={p.id}>
                  {p.type}: {p.title} - {p.date} (Status: {p.status})
                </li>
              ))}
            </ul>
          )}
          <h4>Registrar Nova Produção Científica</h4>
          <form onSubmit={handleAddScientificProduction}>
            <div style={{ marginBottom: "10px" }}>
              <label>Tipo: </label>
              <select value={newProdType} onChange={(e) => setNewProdType(e.target.value as ScientificProduction["type"])} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
                <option value="Livro">Livro</option>
                <option value="Artigo">Artigo</option>
                <option value="Palestra">Palestra</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Título: </label>
              <input type="text" value={newProdTitle} onChange={(e) => setNewProdTitle(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Data: </label>
              <input type="date" value={newProdDate} onChange={(e) => setNewProdDate(e.target.value)} required style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
            </div>
            <button type="submit" style={{ padding: "8px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Registrar Produção
            </button>
          </form>
        </div>
      </div>

      {/* Histórico de Evolução */}
      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
        <h3>Histórico de Evolução</h3>
        {professor.evolutionHistory.length === 0 ? (
          <p>Nenhum evento de evolução registrado.</p>
        ) : (
          <ul>
            {professor.evolutionHistory.map((event: EvolutionEvent, index: number) => (
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

export default ProfessorDashboard;
