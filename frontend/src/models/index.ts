
// src/models/index.ts (This file will be created next)

export type UserRole = "PROFESSOR" | "FUNCIONARIO" | "RH" | "CHEFIA" | "REITOR";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  serverId?: string; // Link to a Professor or Funcionario
}

export interface Server {
  id: string;
  name: string;
  type: "PROFESSOR" | "FUNCIONARIO";
  sector?: string; // For FUNCIONARIO
  unit?: string; // For PROFESSOR
  baseSalary: number;
  currentSalary: number;
  // Common to both
  evolutionHistory: EvolutionEvent[];
}

export interface Professor extends Server {
  type: "PROFESSOR";
  titrations: Titration[];
  scientificProductions: ScientificProduction[];
}

export interface Funcionario extends Server {
  type: "FUNCIONARIO";
  functionsPerformed: FunctionPerformed[];
  evaluations: Evaluation[];
}

export interface Titration {
  id: string;
  professorId: string;
  type: "Especialização" | "Mestrado" | "Doutorado" | "Pós-Doutorado";
  conclusionDate: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
}

export interface ScientificProduction {
  id: string;
  professorId: string;
  type: "Livro" | "Artigo" | "Palestra" | "Outro";
  title: string;
  date: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
}

export interface FunctionPerformed {
  id: string;
  funcionarioId: string;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface Evaluation {
  id: string;
  funcionarioId: string;
  chefiaId: string;
  score: number;
  comments: string;
  date: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
}

export interface EvolutionEvent {
  type: string;
  description: string;
  date: string; // YYYY-MM-DD
  status: "pending" | "approved" | "rejected";
}
