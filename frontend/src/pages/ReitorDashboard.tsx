import React, { useEffect, useState } from "react";
import { fetchAllServers } from "../services/mockApi";
import { Server, Professor, Funcionario, Titration } from "../models";

const ReitorDashboard: React.FC = () => {
  const [allServers, setAllServers] = useState<Server[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [professorTitrationFilter, setProfessorTitrationFilter] = useState<string>("ALL");
  const [funcionarioSectorFilter, setFuncionarioSectorFilter] = useState<string>("ALL");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const servers = await fetchAllServers();
      setAllServers(servers);
    } catch (err) {
      setError("Erro ao carregar dados dos servidores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const professors = allServers.filter((s) => s.type === "PROFESSOR") as Professor[];
    const funcionarios = allServers.filter((s) => s.type === "FUNCIONARIO") as Funcionario[];

    // Filter Professors
    let currentFilteredProfessors = professors;
    if (professorTitrationFilter !== "ALL") {
      currentFilteredProfessors = professors.filter((p) =>
        p.titrations.some((t) => t.type === professorTitrationFilter && t.status === "approved")
      );
    }
    setFilteredProfessors(currentFilteredProfessors.sort((a, b) => b.currentSalary - a.currentSalary));

    // Filter Funcionarios
    let currentFilteredFuncionarios = funcionarios;
    if (funcionarioSectorFilter !== "ALL") {
      currentFilteredFuncionarios = funcionarios.filter((f) => f.sector === funcionarioSectorFilter);
    }
    setFilteredFuncionarios(currentFilteredFuncionarios.sort((a, b) => b.currentSalary - a.currentSalary));
  }, [allServers, professorTitrationFilter, funcionarioSectorFilter]);

  const getPrimaryTitration = (professor: Professor): string => {
    const approvedTitrations = professor.titrations.filter(t => t.status === 'approved');
    if (approvedTitrations.length === 0) return "N/A";

    const titrationOrder = ["Especialização", "Mestrado", "Doutorado", "Pós-Doutorado"];
    const highestTitration = approvedTitrations.reduce((prev, current) => {
      return titrationOrder.indexOf(current.type) > titrationOrder.indexOf(prev.type) ? current : prev;
    });
    return highestTitration.type;
  };

  const handleExport = () => {
    alert("Exportação simulada: Dados foram 'exportados' com sucesso!");
  };

  const uniqueTitrationTypes = Array.from(
    new Set(
      allServers
        .filter((s) => s.type === "PROFESSOR")
        .flatMap((p) => (p as Professor).titrations.filter(t => t.status === 'approved').map((t) => t.type))
    )
  );

  const uniqueFuncionarioSectors = Array.from(
    new Set(
      allServers
        .filter((s) => s.type === "FUNCIONARIO")
        .map((f) => (f as Funcionario).sector || "N/A")
    )
  );


  if (loading) {
    return <div>Carregando painel do Reitor...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Painel do Reitor</h2>

      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Relatório de Professores</h3>
        <div style={{ marginBottom: "15px" }}>
          <label>Filtrar por Titulação: </label>
          <select value={professorTitrationFilter} onChange={(e) => setProfessorTitrationFilter(e.target.value)} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <option value="ALL">Todas</option>
            {uniqueTitrationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {filteredProfessors.length === 0 ? (
          <p>Nenhum professor encontrado para o filtro selecionado.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nome</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Titulação Principal</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Salário Atual</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfessors.map((professor) => (
                <tr key={professor.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{professor.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getPrimaryTitration(professor)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>R$ {professor.currentSalary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Relatório de Funcionários</h3>
        <div style={{ marginBottom: "15px" }}>
          <label>Filtrar por Setor: </label>
          <select value={funcionarioSectorFilter} onChange={(e) => setFuncionarioSectorFilter(e.target.value)} style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <option value="ALL">Todos</option>
            {uniqueFuncionarioSectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
        {filteredFuncionarios.length === 0 ? (
          <p>Nenhum funcionário encontrado para o filtro selecionado.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Nome</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Setor</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Salário Atual</th>
              </tr>
            </thead>
            <tbody>
              {filteredFuncionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{funcionario.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{funcionario.sector}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>R$ {funcionario.currentSalary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Opções de Relatório</h3>
        <button onClick={handleExport} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Simular Exportação
        </button>
      </div>
    </div>
  );
};

export default ReitorDashboard;
