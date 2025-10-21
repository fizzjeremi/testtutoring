import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Brain } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import ChatInterface from "@/components/chat/ChatInterface";
import StatsCards from "@/components/dashboard/StatsCards";
import Footer from "@/components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signup");
        return;
      }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/signup");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: metrics } = useQuery({
    queryKey: ["metrics", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_metrics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("À bientôt!");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl font-bold text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-gray-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-black">
            <span className="text-gray-900">Bac</span>
            <span className="text-violet-600">Français</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="font-semibold text-[#1F2A74] hover:bg-[#1F2A74]/10"
            >
              ← Retour Tutoring London
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/bibliotheque")}
              className="font-semibold"
            >
              Bibliothèque
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/progres")}
              className="font-semibold"
            >
              Progrès
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/cartes-mentales")}
              className="font-semibold"
            >
              Carte mentale
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/revision")}
              className="font-semibold"
            >
              Révision
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/profil")}
              className="font-semibold"
            >
              Profil
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-2 border-gray-900 rounded-full px-6 py-2 font-bold hover:bg-gray-50"
            >
              Déconnexion
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            Salut {profile?.first_name || ""}!
          </h1>
          <p className="text-gray-600 font-medium">
            Prêt à progresser aujourd'hui ?
          </p>
        </div>

        {/* Stats Row - Compact */}
        <div className="mb-8">
          <StatsCards
            streak={metrics?.streak || 0}
            longestStreak={metrics?.longest_streak || 0}
            sessionsThisWeek={metrics?.sessions_this_week || 0}
            weeklyGoal={metrics?.weekly_goal || 3}
            currentFocus={metrics?.current_focus || null}
            focusProgress={metrics?.focus_progress || 0}
          />
        </div>

        {/* Coach IA Chat - Zone principale (70% de l'écran) */}
        <div className="mb-8">
          <ChatInterface userProfile={profile || undefined} />
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Explore tes outils
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Action 1 : Bibliothèque */}
            <button
              onClick={() => navigate("/bibliotheque")}
              className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-gray-900 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-amber-900" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Bibliothèque</h3>
              <p className="text-gray-600 text-sm mb-4">
                Toutes les ressources pour maîtriser le Bac Français
              </p>
              <div className="text-violet-600 font-bold text-sm">
                Explorer →
              </div>
            </button>

            {/* Action 2 : Mes Progrès */}
            <button
              onClick={() => navigate("/progres")}
              className="bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-gray-900 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-violet-400 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-violet-900" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Mes Progrès</h3>
              <p className="text-gray-600 text-sm mb-4">
                Visualise ton évolution et tes statistiques
              </p>
              <div className="text-violet-600 font-bold text-sm">
                Voir les stats →
              </div>
            </button>

            {/* Action 3 : Carte Mentale */}
            <button
              onClick={() => navigate("/cartes-mentales")}
              className="bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-gray-900 rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer text-left"
            >
              <div className="w-12 h-12 bg-cyan-400 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-cyan-900" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Carte Mentale</h3>
              <p className="text-gray-600 text-sm mb-4">
                Explore tes connaissances de façon visuelle
              </p>
              <div className="text-violet-600 font-bold text-sm">
                Ouvrir →
              </div>
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
