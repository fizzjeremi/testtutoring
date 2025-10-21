import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, Calendar, Award, BookOpen, Clock, Flame } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface UserMetrics {
  streak: number;
  longest_streak: number;
  sessions_this_week: number;
  weekly_goal: number;
  total_sessions: number;
  today_study_minutes: number;
  week_study_minutes: number;
  current_focus: string | null;
  focus_progress: number;
}

const ProgressPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_metrics")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setMetrics(data);
    } catch (error) {
      console.error("Error loading metrics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger tes statistiques",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data pour les graphiques
  const weeklyProgressData = [
    { day: "Lun", minutes: 45, sessions: 2 },
    { day: "Mar", minutes: 60, sessions: 3 },
    { day: "Mer", minutes: 30, sessions: 1 },
    { day: "Jeu", minutes: 90, sessions: 4 },
    { day: "Ven", minutes: 75, sessions: 3 },
    { day: "Sam", minutes: 120, sessions: 5 },
    { day: "Dim", minutes: 40, sessions: 2 },
  ];

  const categoryData = [
    { name: "Méthodologie", value: 35, color: "#8b5cf6" },
    { name: "Figures de style", value: 25, color: "#ec4899" },
    { name: "Auteurs", value: 20, color: "#f59e0b" },
    { name: "Oral", value: 15, color: "#10b981" },
    { name: "Exercices", value: 5, color: "#06b6d4" },
  ];

  const monthlyData = [
    { month: "Sep", heures: 12 },
    { month: "Oct", heures: 18 },
    { month: "Nov", heures: 25 },
    { month: "Déc", heures: 32 },
    { month: "Jan", heures: 28 },
    { month: "Fév", heures: 35 },
  ];

  const achievements = [
    { id: 1, title: "Premier pas", description: "Première session complétée", unlocked: true, icon: "🎯" },
    { id: 2, title: "Régularité", description: "7 jours de suite", unlocked: true, icon: "🔥" },
    { id: 3, title: "Marathonien", description: "10 heures en un mois", unlocked: true, icon: "⏱️" },
    { id: 4, title: "Expert", description: "50 ressources consultées", unlocked: false, icon: "📚" },
    { id: 5, title: "Perfectionniste", description: "100% sur 10 quiz", unlocked: false, icon: "💯" },
    { id: 6, title: "Champion", description: "30 jours de streak", unlocked: false, icon: "🏆" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold text-gray-600">Chargement...</div>
      </div>
    );
  }

  const weekProgress = metrics ? (metrics.sessions_this_week / metrics.weekly_goal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
            className="border-2 border-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-4xl font-black text-gray-900">Ma progression</h1>
            <p className="text-gray-600 mt-1">Suivi détaillé de ton apprentissage</p>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-900 bg-gradient-to-br from-violet-100 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Série actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">{metrics?.streak || 0} jours</div>
              <p className="text-sm text-gray-600 mt-1">Record: {metrics?.longest_streak || 0} jours</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-900 bg-gradient-to-br from-green-100 to-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Objectif hebdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {metrics?.sessions_this_week || 0}/{metrics?.weekly_goal || 3}
              </div>
              <Progress value={weekProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-900 bg-gradient-to-br from-amber-100 to-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {Math.floor((metrics?.week_study_minutes || 0) / 60)}h{(metrics?.week_study_minutes || 0) % 60}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Aujourd'hui: {metrics?.today_study_minutes || 0}min
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-900 bg-gradient-to-br from-pink-100 to-rose-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Sessions totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">{metrics?.total_sessions || 0}</div>
              <p className="text-sm text-gray-600 mt-1">Depuis le début</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 border-2 border-gray-900">
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
            <TabsTrigger value="focus">Focus actuel</TabsTrigger>
            <TabsTrigger value="achievements">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            {/* Progression hebdomadaire */}
            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Activité de la semaine
                </CardTitle>
                <CardDescription>Temps d'étude et nombre de sessions par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Répartition par catégorie */}
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Temps passé sur chaque type de contenu</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Évolution mensuelle */}
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle>Évolution sur 6 mois</CardTitle>
                  <CardDescription>Nombre d'heures d'étude par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="heures" stroke="#8b5cf6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="focus">
            <Card className="border-2 border-gray-900">
              <CardHeader className="bg-gradient-to-br from-violet-100 to-purple-100">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Focus en cours
                </CardTitle>
                <CardDescription>Ton objectif d'apprentissage du moment</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {metrics?.current_focus ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">{metrics.current_focus}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-semibold text-gray-700">Progression</span>
                        <span className="font-bold text-violet-600">{metrics.focus_progress}%</span>
                      </div>
                      <Progress value={metrics.focus_progress} className="h-3" />
                    </div>

                    <div className="bg-violet-50 border-2 border-violet-200 rounded-xl p-4">
                      <p className="font-semibold text-violet-900 mb-2">💡 Conseil</p>
                      <p className="text-sm text-violet-800">
                        Continue à travailler régulièrement sur ce sujet. Tu es sur la bonne voie !
                      </p>
                    </div>

                    <Button className="w-full bg-violet-600 hover:bg-violet-700 font-bold">
                      Continuer le focus
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-600 mb-2">Aucun focus défini</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Choisis un objectif d'apprentissage pour te concentrer dessus
                    </p>
                    <Button variant="outline" className="border-2 border-gray-900">
                      Définir un focus
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`border-2 transition-all ${
                    achievement.unlocked
                      ? "border-gray-900 bg-gradient-to-br from-amber-100 to-yellow-100"
                      : "border-gray-300 bg-gray-50 opacity-60"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      {achievement.unlocked && (
                        <Badge className="bg-green-600 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Débloqué
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressPage;
