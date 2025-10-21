import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap,
  BookOpen,
  Target,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ChatInterface from "@/components/chat/ChatInterface";

const Revision = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMode = (modeId: string) => {
    const routes: Record<string, string> = {
      flashcards: "/revision/flashcards",
      quiz: "/revision/quiz",
      fiches: "/revision/fiches"
    };
    
    if (routes[modeId]) {
      navigate(routes[modeId]);
    }
  };

  const revisionModes = [
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Révision rapide de définitions, notions et citations clés. Tu peux aussi créer tes propres flashcards à partir de tes cours pour les réviser plus tard.",
      icon: Zap,
      color: "from-amber-100 to-yellow-100",
      iconBg: "bg-amber-400",
      iconColor: "text-amber-900",
      buttonText: "Créer / Réviser"
    },
    {
      id: "quiz",
      title: "Quiz",
      description: "Teste tes connaissances sur les œuvres, les auteurs et les mouvements littéraires. L'IA peut te proposer des quiz ciblés selon ton niveau ou tes révisions récentes.",
      icon: BookOpen,
      color: "from-orange-100 to-amber-100",
      iconBg: "bg-orange-400",
      iconColor: "text-orange-900",
      buttonText: "Commencer"
    },
    {
      id: "fiches",
      title: "Fiches personnelles",
      description: "Crée tes propres fiches de révision à partir de tes cours, textes et citations. Tu peux les sauvegarder, les modifier et les exporter en PDF.",
      icon: Target,
      color: "from-yellow-100 to-orange-100",
      iconBg: "bg-yellow-400",
      iconColor: "text-yellow-900",
      buttonText: "Créer une fiche"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Préparation de ta session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="border-2 border-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-600" />
                <h1 className="text-4xl font-black text-gray-900">Module Bac Français</h1>
              </div>
              <p className="text-gray-600 mt-2">Mémorise et consolide tes connaissances pour le Bac</p>
            </div>
          </div>

          {/* Modes de révision */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Choisis ton mode de révision</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {revisionModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Card
                    key={mode.id}
                    className="border-2 border-gray-900 hover:shadow-xl transition-all"
                  >
                    <CardContent className={`p-6 bg-gradient-to-br ${mode.color}`}>
                      <div className={`w-12 h-12 ${mode.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${mode.iconColor}`} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">{mode.title}</h3>
                      <p className="text-gray-700 text-sm mb-6">{mode.description}</p>
                      <Button
                        onClick={() => navigateToMode(mode.id)}
                        className="w-full bg-gray-900 hover:bg-gray-800 font-bold"
                      >
                        {mode.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Coach IA - Révision en direct */}
          <div>
            <ChatInterface 
              userProfile={userProfile} 
              initialMode="revision"
              revisionSuggestions={[
                "Je veux réviser les figures de style.",
                "Aide-moi à comprendre un texte de Baudelaire.",
                "Peux-tu me générer un quiz sur le romantisme ?",
                "Fais-moi une fiche de révision sur le registre tragique.",
                "Crée une série de 10 flashcards sur les connecteurs logiques."
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revision;
