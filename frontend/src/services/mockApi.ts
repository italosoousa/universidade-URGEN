import {
  User,
  Server,
  Professor,
  Funcionario,
  Titration,
  ScientificProduction,
  FunctionPerformed,
  Evaluation,
  UserRole,
  EvolutionEvent,
} from "../models";

// --- Mock Data ---

const mockUsers: User[] = [
  { id: "u1", username: "professor1", password: "123", role: "PROFESSOR", serverId: "s1" },
  { id: "u2", username: "funcionario1", password: "123", role: "FUNCIONARIO", serverId: "s2" },
  { id: "u3", username: "rh1", password: "123", role: "RH" },
  { id: "u4", username: "chefia1", password: "123", role: "CHEFIA", serverId: "s3" },
  { id: "u5", username: "reitor1", password: "123", role: "REITOR" },
  { id: "u6", username: "professor2", password: "123", role: "PROFESSOR", serverId: "s4" },
  { id: "u7", username: "funcionario2", password: "123", role: "FUNCIONARIO", serverId: "s5" },
];

let mockTitrations: Titration[] = [
  {
    id: "t1",
    professorId: "s1",
    type: "Mestrado",
    conclusionDate: "2010-06-15",
    status: "approved",
  },
  {
    id: "t2",
    professorId: "s1",
    type: "Doutorado",
    conclusionDate: "2015-03-20",
    status: "approved",
  },
  {
    id: "t3",
    professorId: "s4",
    type: "Especialização",
    conclusionDate: "2018-01-10",
    status: "approved",
  },
  {
    id: "t4",
    professorId: "s4",
    type: "Pós-Doutorado",
    conclusionDate: "2023-11-01",
    status: "pending",
  },
];

let mockScientificProductions: ScientificProduction[] = [
  {
    id: "p1",
    professorId: "s1",
    type: "Artigo",
    title: "Avanços em Engenharia de Software",
    date: "2018-09-01",
    status: "approved",
  },
  {
    id: "p2",
    professorId: "s1",
    type: "Livro",
    title: "Padrões de Projeto Modernos",
    date: "2020-05-20",
    status: "approved",
  },
  {
    id: "p3",
    professorId: "s4",
    type: "Palestra",
    title: "O Futuro da IA na Educação",
    date: "2022-03-10",
    status: "pending",
  },
];

let mockFunctionsPerformed: FunctionPerformed[] = [
  { id: "f1", funcionarioId: "s2", role: "Assistente Administrativo", startDate: "2012-01-01", endDate: "2018-12-31" },
  { id: "f2", funcionarioId: "s2", role: "Analista Financeiro Júnior", startDate: "2019-01-01" },
  { id: "f3", funcionarioId: "s5", role: "Técnico de Laboratório", startDate: "2015-05-01" },
];

let mockEvaluations: Evaluation[] = [
  {
    id: "e1",
    funcionarioId: "s2",
    chefiaId: "s3",
    score: 8,
    comments: "Bom desempenho geral.",
    date: "2023-01-20",
    status: "approved",
  },
  {
    id: "e2",
    funcionarioId: "s2",
    chefiaId: "s3",
    score: 9,
    comments: "Superou as expectativas no último projeto.",
    date: "2024-01-25",
    status: "pending",
  },
  {
    id: "e3",
    funcionarioId: "s5",
    chefiaId: "s3",
    score: 7,
    comments: "Necessita melhorar organização.",
    date: "2023-03-10",
    status: "approved",
  },
];

let mockServers: Server[] = [
  {
    id: "s1",
    name: "Dr. João Silva",
    type: "PROFESSOR",
    unit: "Ciência da Computação",
    baseSalary: 5000,
    currentSalary: 5000,
    evolutionHistory: [],
  } as Professor,
  {
    id: "s2",
    name: "Maria Oliveira",
    type: "FUNCIONARIO",
    sector: "Financeiro",
    baseSalary: 3000,
    currentSalary: 3000,
    evolutionHistory: [],
  } as Funcionario,
  {
    id: "s3",
    name: "Carlos Souza (Chefia)",
    type: "FUNCIONARIO",
    sector: "RH",
    baseSalary: 4500,
    currentSalary: 4500,
    evolutionHistory: [],
  } as Funcionario,
  {
    id: "s4",
    name: "Profa. Ana Costa",
    type: "PROFESSOR",
    unit: "Engenharia Civil",
    baseSalary: 4800,
    currentSalary: 4800,
    evolutionHistory: [],
  } as Professor,
  {
    id: "s5",
    name: "Pedro Santos",
    type: "FUNCIONARIO",
    sector: "Acadêmico",
    baseSalary: 3200,
    currentSalary: 3200,
    evolutionHistory: [],
  } as Funcionario,
];

// Populate specific server data and evolution histories
mockServers = mockServers.map((server) => {
  if (server.type === "PROFESSOR") {
    const professor = server as Professor;
    professor.titrations = mockTitrations.filter((t) => t.professorId === professor.id);
    professor.scientificProductions = mockScientificProductions.filter(
      (p) => p.professorId === professor.id
    );
    professor.evolutionHistory = [
      ...professor.titrations.map((t) => ({
        type: `Titulação: ${t.type}`,
        description: `Conclusão em ${t.conclusionDate}`,
        date: t.conclusionDate,
        status: t.status,
      })),
      ...professor.scientificProductions.map((p) => ({
        type: `Produção Científica: ${p.type}`,
        description: p.title,
        date: p.date,
        status: p.status,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return professor;
  } else {
    const funcionario = server as Funcionario;
    funcionario.functionsPerformed = mockFunctionsPerformed.filter(
      (f) => f.funcionarioId === funcionario.id
    );
    funcionario.evaluations = mockEvaluations.filter((e) => e.funcionarioId === funcionario.id);
    funcionario.evolutionHistory = [
      ...funcionario.functionsPerformed.map((f) => ({
        type: `Função: ${f.role}`,
        description: `Início: ${f.startDate}` + (f.endDate ? `, Fim: ${f.endDate}` : ""),
        date: f.startDate,
        status: "approved", // Assuming functions are always approved once performed
      })),
      ...funcionario.evaluations.map((e) => ({
        type: `Avaliação de Desempenho`,
        description: `Pontuação: ${e.score} - ${e.comments}`,
        date: e.date,
        status: e.status,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return funcionario;
  }
});

// --- Utility Functions ---

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- API Simulation Functions ---

export const mockLogin = async (username: string, password: string): Promise<User | null> => {
  await delay(500); // Simulate network delay
  const user = mockUsers.find((u) => u.username === username && u.password === password);
  return user || null;
};

export const fetchServerById = async (serverId: string): Promise<Server | null> => {
  await delay(300);
  return mockServers.find((s) => s.id === serverId) || null;
};

export const fetchAllServers = async (): Promise<Server[]> => {
  await delay(300);
  return [...mockServers];
};

export const addTitration = async (newTitration: Omit<Titration, "id" | "status">): Promise<Titration> => {
  await delay(300);
  const titration: Titration = {
    ...newTitration,
    id: `t${mockTitrations.length + 1}`,
    status: "pending",
  };
  mockTitrations.push(titration);
  // Update professor's evolution history
  const professor = mockServers.find(s => s.id === titration.professorId) as Professor;
  if (professor) {
    professor.titrations.push(titration);
    professor.evolutionHistory.push({
      type: `Titulação: ${titration.type}`,
      description: `Conclusão em ${titration.conclusionDate}`,
      date: titration.conclusionDate,
      status: "pending",
    });
    professor.evolutionHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  return titration;
};

export const addScientificProduction = async (
  newProduction: Omit<ScientificProduction, "id" | "status">
): Promise<ScientificProduction> => {
  await delay(300);
  const production: ScientificProduction = {
    ...newProduction,
    id: `p${mockScientificProductions.length + 1}`,
    status: "pending",
  };
  mockScientificProductions.push(production);
  // Update professor's evolution history
  const professor = mockServers.find(s => s.id === production.professorId) as Professor;
  if (professor) {
    professor.scientificProductions.push(production);
    professor.evolutionHistory.push({
      type: `Produção Científica: ${production.type}`,
      description: production.title,
      date: production.date,
      status: "pending",
    });
    professor.evolutionHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  return production;
};

export const addEvaluation = async (
  newEvaluation: Omit<Evaluation, "id" | "status">
): Promise<Evaluation> => {
  await delay(300);
  const evaluation: Evaluation = {
    ...newEvaluation,
    id: `e${mockEvaluations.length + 1}`,
    status: "pending",
  };
  mockEvaluations.push(evaluation);
  // Update funcionario's evolution history
  const funcionario = mockServers.find(s => s.id === evaluation.funcionarioId) as Funcionario;
  if (funcionario) {
    funcionario.evaluations.push(evaluation);
    funcionario.evolutionHistory.push({
      type: `Avaliação de Desempenho`,
      description: `Pontuação: ${evaluation.score} - ${evaluation.comments}`,
      date: evaluation.date,
      status: "pending",
    });
    funcionario.evolutionHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  return evaluation;
};

export const updateTitrationStatus = async (
  titrationId: string,
  status: "approved" | "rejected"
): Promise<Titration | null> => {
  await delay(300);
  const index = mockTitrations.findIndex((t) => t.id === titrationId);
  if (index > -1) {
    mockTitrations[index].status = status;
    // Update professor's evolution history as well
    const professor = mockServers.find(s => s.id === mockTitrations[index].professorId) as Professor;
    if (professor) {
      const eventIndex = professor.evolutionHistory.findIndex(
        (e) => e.type.startsWith("Titulação") && e.description.includes(mockTitrations[index].conclusionDate)
      );
      if (eventIndex > -1) {
        professor.evolutionHistory[eventIndex].status = status;
      }
    }
    return mockTitrations[index];
  }
  return null;
};

export const updateScientificProductionStatus = async (
  productionId: string,
  status: "approved" | "rejected"
): Promise<ScientificProduction | null> => {
  await delay(300);
  const index = mockScientificProductions.findIndex((p) => p.id === productionId);
  if (index > -1) {
    mockScientificProductions[index].status = status;
    // Update professor's evolution history as well
    const professor = mockServers.find(s => s.id === mockScientificProductions[index].professorId) as Professor;
    if (professor) {
      const eventIndex = professor.evolutionHistory.findIndex(
        (e) => e.type.startsWith("Produção Científica") && e.description.includes(mockScientificProductions[index].title)
      );
      if (eventIndex > -1) {
        professor.evolutionHistory[eventIndex].status = status;
      }
    }
    return mockScientificProductions[index];
  }
  return null;
};

export const updateEvaluationStatus = async (
  evaluationId: string,
  status: "approved" | "rejected"
): Promise<Evaluation | null> => {
  await delay(300);
  const index = mockEvaluations.findIndex((e) => e.id === evaluationId);
  if (index > -1) {
    mockEvaluations[index].status = status;
    // Update funcionario's evolution history as well
    const funcionario = mockServers.find(s => s.id === mockEvaluations[index].funcionarioId) as Funcionario;
    if (funcionario) {
      const eventIndex = funcionario.evolutionHistory.findIndex(
        (e) => e.type.startsWith("Avaliação de Desempenho") && e.description.includes(mockEvaluations[index].comments)
      );
      if (eventIndex > -1) {
        funcionario.evolutionHistory[eventIndex].status = status;
      }
    }
    return mockEvaluations[index];
  }
  return null;
};

export const addMockServer = async (
  newServer: Omit<Server, "id" | "currentSalary" | "evolutionHistory">
): Promise<Server> => {
  await delay(300);
  const server: Server = {
    ...newServer,
    id: `s${mockServers.length + 1}`,
    currentSalary: newServer.baseSalary,
    evolutionHistory: [],
  };
  mockServers.push(server);
  return server;
};

import { calculateAllAnnualSalaries } from "../utils/salaryCalculator";

// Functions for salary calculation
export const calculateAnnualSalaries = async (): Promise<Server[]> => {
  await delay(500);
  mockServers = calculateAllAnnualSalaries(mockServers);
  return [...mockServers];
};

// Get pending evolutions for RH
export const fetchPendingEvolutions = async () => {
  await delay(300);
  const pendingTitrations = mockTitrations.filter((t) => t.status === "pending");
  const pendingScientificProductions = mockScientificProductions.filter(
    (p) => p.status === "pending"
  );
  const pendingEvaluations = mockEvaluations.filter((e) => e.status === "pending");

  return {
    pendingTitrations,
    pendingScientificProductions,
    pendingEvaluations,
  };
};

export {
  mockUsers,
  mockServers,
  mockTitrations,
  mockScientificProductions,
  mockFunctionsPerformed,
  mockEvaluations,
};
