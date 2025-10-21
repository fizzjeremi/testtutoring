import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Level = "debutant" | "moyen" | "avance" | null;
type Challenge = "structure" | "exemples" | "oral" | "comprendre" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState<Level>(null);
  const [mainChallenge, setMainChallenge] = useState<Challenge>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signup");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!currentLevel || !mainChallenge) {
      toast.error("Réponds aux deux questions!");
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Tu dois être connecté");
      navigate("/signup");
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        current_level: currentLevel,
        main_challenge: mainChallenge,
      })
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      return;
    }

    toast.success("Profil complété! 🎉");
    navigate("/");
  };

  const levels = [
    {
      value: "debutant" as Level,
      color: "cyan",
      label: "Débutant",
      subtitle: "Je découvre",
    },
    {
      value: "moyen" as Level,
      color: "violet",
      label: "Moyen",
      subtitle: "Je me débrouille",
    },
    {
      value: "avance" as Level,
      color: "fuchsia",
      label: "Avancé",
      subtitle: "Je maîtrise",
    },
  ];

  const challenges = [
    { value: "structure" as Challenge, label: "Structurer mes dissertations", icon: "📝" },
    { value: "exemples" as Challenge, label: "Trouver des exemples littéraires", icon: "📚" },
    { value: "oral" as Challenge, label: "L'oral me stresse", icon: "🎤" },
    { value: "comprendre" as Challenge, label: "Comprendre les attentes", icon: "🤔" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Dis-nous en plus</h1>
          <p className="text-gray-600 font-medium">Pour personnaliser ton expérience</p>
        </div>

        {/* Card */}
        <div className="border-2 border-gray-900 rounded-3xl p-8 shadow-xl bg-white">
          {/* Question 1 */}
          <div className="mb-8">
            <h2 className="font-black text-gray-900 mb-4">Quel est ton niveau actuel?</h2>
            <div className="grid grid-cols-3 gap-3">
              {levels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setCurrentLevel(level.value)}
                  className={`
                    p-6 border-2 rounded-2xl cursor-pointer transition-all
                    ${
                      currentLevel === level.value
                        ? "border-gray-900 scale-105 shadow-lg"
                        : `border-gray-200 hover:bg-${level.color}-50`
                    }
                  `}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-${level.color}-400 mb-3`}
                  ></div>
                  <div className="font-black text-gray-900">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="mb-8">
            <h2 className="font-black text-gray-900 mb-4">Ton plus grand défi?</h2>
            <div className="space-y-2">
              {challenges.map((challenge) => (
                <button
                  key={challenge.value}
                  onClick={() => setMainChallenge(challenge.value)}
                  className={`
                    w-full flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all
                    ${
                      mainChallenge === challenge.value
                        ? "border-gray-900 bg-amber-100"
                        : "border-gray-200 hover:border-gray-400"
                    }
                  `}
                >
                  <span className="text-2xl">{challenge.icon}</span>
                  <span className="font-bold text-gray-900">{challenge.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!currentLevel || !mainChallenge || loading}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Let's go!"}
            <Zap className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
