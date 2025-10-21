import { AGENT_CONFIG, AgentMode, UserLevel } from "./AgentConfig";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
  metadata?: {
    mode?: AgentMode;
    suggestions?: string[];
    ficheGenerated?: boolean;
  };
}

export interface AgentContext {
  user_first_name?: string;
  user_level?: UserLevel;
  user_challenge?: string;
  current_mode?: AgentMode;
  current_topic?: string;
  stress_level?: "faible" | "moyen" | "élevé";
  conversation_history?: ChatMessage[];
}

export class AgentClient {
  private agentId: string;
  private baseUrl: string;
  
  constructor() {
    this.agentId = AGENT_CONFIG.agentId;
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent`;
  }
  
  async sendMessage(
    message: string,
    context: AgentContext,
    stream: boolean = true
  ): Promise<Response> {
    const payload = {
      message: {
        role: "user",
        content: message
      },
      context: this.buildContextPrompt(context),
      stream
    };
    
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Agent API error: ${response.statusText}`);
    }
    
    return response;
  }
  
  async *streamResponse(response: Response): AsyncGenerator<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) throw new Error("No response body");
    
    let buffer = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (let line of lines) {
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch (e) {
          console.error("Parse error:", e);
        }
      }
    }
    
    // Process remaining buffer
    if (buffer.trim()) {
      for (let line of buffer.split("\n")) {
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch { /* ignore */ }
      }
    }
  }
  
  private buildContextPrompt(context: AgentContext): string {
    let prompt = "";
    
    if (context.user_first_name) {
      prompt += `Prénom de l'élève: ${context.user_first_name}\n`;
    }
    
    if (context.user_level) {
      prompt += `Niveau: ${context.user_level}\n`;
    }
    
    if (context.user_challenge) {
      prompt += `Défi principal: ${context.user_challenge}\n`;
    }
    
    if (context.current_mode) {
      prompt += `Mode actif: ${context.current_mode}\n`;
    }
    
    if (context.stress_level) {
      prompt += `Niveau de stress: ${context.stress_level}\n`;
    }
    
    if (context.conversation_history && context.conversation_history.length > 0) {
      prompt += "\nHistorique récent:\n";
      const recentHistory = context.conversation_history.slice(-5);
      recentHistory.forEach(msg => {
        prompt += `${msg.role}: ${msg.content.substring(0, 100)}...\n`;
      });
    }
    
    return prompt;
  }
}

export const agentClient = new AgentClient();
