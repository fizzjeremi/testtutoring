export const AGENT_CONFIG = {
  // ID de l'agent (à configurer)
  agentId: import.meta.env.VITE_AGENT_ID || "269ca65b-a2e2-4d10-a88d-bd6d137ed99d",
  
  // Modes disponibles
  modes: {
    EXPLICATIF: "explicatif",
    CREATEUR: "createur",
    EXAMINATEUR: "examinateur",
    CORRECTEUR: "correcteur",
    ENTRAINEUR: "entraineur",
    COMPAGNON: "compagnon",
    ANALYTIQUE: "analytique",
    REVISION: "revision"
  } as const,
  
  // Niveaux scolaires
  levels: {
    COLLEGE_3E: "3e",
    LYCEE_2NDE: "2nde",
    LYCEE_1RE: "1re",
    LYCEE_TERM: "term",
    SUPERIEUR: "superieur"
  } as const,
  
  // Configuration du chat
  chat: {
    maxTokens: 2000,
    temperature: 0.7,
    streamEnabled: true,
    typingDelay: 50,
    maxHistoryMessages: 50
  },
  
  // Suggestions
  suggestions: {
    maxSuggestions: 4,
    autoGenerate: true,
    contextualOnly: true
  }
};

export type AgentMode = typeof AGENT_CONFIG.modes[keyof typeof AGENT_CONFIG.modes];
export type UserLevel = typeof AGENT_CONFIG.levels[keyof typeof AGENT_CONFIG.levels];
