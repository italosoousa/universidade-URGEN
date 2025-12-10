import { Server, Professor, Funcionario, Titration, ScientificProduction, Evaluation } from "../models";

// Define salary rules (simplified for mock data)
const SALARY_RULES = {
  PROFESSOR: {
    baseTitrationBonus: {
      Especialização: 0.05, // 5%
      Mestrado: 0.10, // 10%
      Doutorado: 0.15, // 15%
      "Pós-Doutorado": 0.20, // 20%
    },
    scientificProductionValue: {
      Livro: 100,
      Artigo: 50,
      Palestra: 20,
      Outro: 10,
    },
  },
  FUNCIONARIO: {
    roleFactor: {
      "Assistente Administrativo": 1.0,
      "Analista Financeiro Júnior": 1.1,
      "Técnico de Laboratório": 1.05,
      "Chefia": 1.2,
      // Add more roles as needed
    },
    evaluationBonusMultiplier: 0.02, // 2% bonus per score point above 5
  },
};

export const calculateProfessorSalary = (professor: Professor): number => {
  let calculatedSalary = professor.baseSalary;

  // 1. Titulation Bonus (based on highest approved titration)
  const approvedTitrations = professor.titrations.filter((t) => t.status === "approved");
  if (approvedTitrations.length > 0) {
    const titrationOrder = ["Especialização", "Mestrado", "Doutorado", "Pós-Doutorado"];
    let highestTitrationBonus = 0;
    approvedTitrations.forEach((t) => {
      const bonus = SALARY_RULES.PROFESSOR.baseTitrationBonus[t.type] || 0;
      if (bonus > highestTitrationBonus) {
        highestTitrationBonus = bonus;
      }
    });
    calculatedSalary += professor.baseSalary * highestTitrationBonus;
  }

  // 2. Scientific Production Bonus
  let scientificProductionPoints = 0;
  professor.scientificProductions.filter(p => p.status === 'approved').forEach((p) => {
    scientificProductionPoints += SALARY_RULES.PROFESSOR.scientificProductionValue[p.type] || 0;
  });
  calculatedSalary += scientificProductionPoints; // Direct addition for simplicity

  return calculatedSalary;
};

export const calculateFuncionarioSalary = (funcionario: Funcionario): number => {
  let calculatedSalary = funcionario.baseSalary;

  // 1. Role Factor (based on current role)
  const currentRole = funcionario.functionsPerformed.find((f) => !f.endDate);
  if (currentRole) {
    const factor = SALARY_RULES.FUNCIONARIO.roleFactor[currentRole.role] || 1.0;
    calculatedSalary *= factor;
  }

  // 2. Performance Evaluation Bonus (based on latest approved evaluation, if score > 5)
  const approvedEvaluations = funcionario.evaluations
    .filter((e) => e.status === "approved")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Latest first

  if (approvedEvaluations.length > 0) {
    const latestEvaluation = approvedEvaluations[0];
    if (latestEvaluation.score > 5) {
      const bonusPercentage = (latestEvaluation.score - 5) * SALARY_RULES.FUNCIONARIO.evaluationBonusMultiplier;
      calculatedSalary += calculatedSalary * bonusPercentage;
    }
  }

  return calculatedSalary;
};

export const calculateAllAnnualSalaries = (servers: Server[]): Server[] => {
    return servers.map((server) => {
      let updatedServer = { ...server };
      if (server.type === "PROFESSOR") {
        updatedServer.currentSalary = calculateProfessorSalary(server as Professor);
      } else if (server.type === "FUNCIONARIO") {
        updatedServer.currentSalary = calculateFuncionarioSalary(server as Funcionario);
      }
      return updatedServer;
    });
  };
