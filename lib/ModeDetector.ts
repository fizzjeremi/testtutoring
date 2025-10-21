import { AGENT_CONFIG, AgentMode } from "./AgentConfig";

export class ModeDetector {
  static detectMode(userMessage: string, currentMode?: AgentMode): AgentMode {
    const messageLower = userMessage.toLowerCase();
    
    const patterns = {
      [AGENT_CONFIG.modes.EXPLICATIF]: [
        "explique", "comment faire", "c'est quoi", "qu'est-ce que",
        "méthodologie", "méthode", "comment"
      ],
      
      [AGENT_CONFIG.modes.CREATEUR]: [
        "crée", "génère", "fais-moi", "fiche", "résumé",
        "tableau", "schéma"
      ],
      
      [AGENT_CONFIG.modes.EXAMINATEUR]: [
        "teste-moi", "quiz", "question", "entraîne",
        "pose-moi", "simulation", "oral blanc"
      ],
      
      [AGENT_CONFIG.modes.CORRECTEUR]: [
        "corrige", "regarde", "voilà", "feedback",
        "qu'est-ce que tu penses", "avis"
      ],
      
      [AGENT_CONFIG.modes.ENTRAINEUR]: [
        "entraîner", "pratiquer", "exercice", "progressif",
        "s'entraîner", "exercices"
      ],
      
      [AGENT_CONFIG.modes.COMPAGNON]: [
        "stress", "peur", "découragé", "motivation",
        "aide-moi", "perdu", "angoisse"
      ],
      
      [AGENT_CONFIG.modes.ANALYTIQUE]: [
        "analyse", "décompose", "décortique", "sujet",
        "qu'en penses-tu", "comment aborder"
      ],
      
      [AGENT_CONFIG.modes.REVISION]: [
        "révise", "révision", "flashcard", "mémorise",
        "quiz", "fiche", "apprendre", "retenir"
      ]
    };
    
    const scores: Record<string, number> = {};
    
    for (const [mode, keywords] of Object.entries(patterns)) {
      scores[mode] = keywords.filter(kw => 
        messageLower.includes(kw)
      ).length;
    }
    
    const detectedMode = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    ) as AgentMode;
    
    if (scores[detectedMode] === 0) {
      return currentMode || AGENT_CONFIG.modes.EXPLICATIF;
    }
    
    return detectedMode;
  }
  
  static getModeDisplay(mode: AgentMode): {
    icon: string;
    label: string;
    color: string;
  } {
    const displays = {
      [AGENT_CONFIG.modes.EXPLICATIF]: {
        icon: "📚",
        label: "Mode Explicatif",
        color: "blue"
      },
      [AGENT_CONFIG.modes.CREATEUR]: {
        icon: "🎨",
        label: "Mode Créateur",
        color: "purple"
      },
      [AGENT_CONFIG.modes.EXAMINATEUR]: {
        icon: "🎯",
        label: "Mode Examinateur",
        color: "red"
      },
      [AGENT_CONFIG.modes.CORRECTEUR]: {
        icon: "✏️",
        label: "Mode Correcteur",
        color: "orange"
      },
      [AGENT_CONFIG.modes.ENTRAINEUR]: {
        icon: "💪",
        label: "Mode Entraîneur",
        color: "green"
      },
      [AGENT_CONFIG.modes.COMPAGNON]: {
        icon: "🤝",
        label: "Mode Compagnon",
        color: "pink"
      },
      [AGENT_CONFIG.modes.ANALYTIQUE]: {
        icon: "🔬",
        label: "Mode Analytique",
        color: "teal"
      },
      [AGENT_CONFIG.modes.REVISION]: {
        icon: "⚡",
        label: "Mode Révision",
        color: "amber"
      }
    };
    
    return displays[mode];
  }
}
