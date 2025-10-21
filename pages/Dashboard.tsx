import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, FileText, Users, TrendingUp, Clock } from "lucide-react";

const Dashboard = () => {
  const { role } = useUserRole();
  const [stats, setStats] = useState({
    upcomingLessons: 0,
    totalLessons: 0,
    totalUsers: 0,
    totalRevenue: 0,
    completedLessons: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    loadStats();
  }, [role]);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load lessons stats
      const { count: upcomingCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', new Date().toISOString())
        .in('status', ['confirmed', 'requested']);

      const { count: totalCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      const { count: completedCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      const { count: pendingCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'requested');

      // Load users stats (admin only)
      let totalUsers = 0;
      if (role === 'super_admin') {
        const { count: usersCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });
        totalUsers = usersCount || 0;
      }

      // Load revenue stats (admin only)
      let totalRevenue = 0;
      if (role === 'super_admin') {
        const { data: invoices } = await supabase
          .from('invoices')
          .select('amount')
          .eq('status', 'paid');
        
        totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      }

      setStats({
        upcomingLessons: upcomingCount || 0,
        totalLessons: totalCount || 0,
        totalUsers,
        totalRevenue,
        completedLessons: completedCount || 0,
        pendingRequests: pendingCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'student': return 'Élève';
      case 'teacher': return 'Professeur';
      case 'parent': return 'Parent';
      case 'super_admin': return 'Administrateur';
      default: return 'Utilisateur';
    }
  };

  const studentTeacherStats = [
    {
      title: "Cours à venir",
      value: stats.upcomingLessons,
      description: "cours confirmés",
      icon: Calendar,
      gradient: "from-blue-100 to-sky-100",
      iconBg: "bg-blue-400",
      iconColor: "text-blue-900",
    },
    {
      title: "Total des cours",
      value: stats.totalLessons,
      description: "depuis le début",
      icon: BookOpen,
      gradient: "from-emerald-100 to-green-100",
      iconBg: "bg-emerald-400",
      iconColor: "text-emerald-900",
    },
    {
      title: "Cours terminés",
      value: stats.completedLessons,
      description: "avec succès",
      icon: TrendingUp,
      gradient: "from-indigo-100 to-blue-100",
      iconBg: "bg-indigo-400",
      iconColor: "text-indigo-900",
    },
  ];

  const adminStats = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      description: "inscrits",
      icon: Users,
      gradient: "from-blue-100 to-sky-100",
      iconBg: "bg-blue-400",
      iconColor: "text-blue-900",
    },
    {
      title: "Cours totaux",
      value: stats.totalLessons,
      description: "sessions",
      icon: BookOpen,
      gradient: "from-emerald-100 to-green-100",
      iconBg: "bg-emerald-400",
      iconColor: "text-emerald-900",
    },
    {
      title: "En attente",
      value: stats.pendingRequests,
      description: "demandes",
      icon: Clock,
      gradient: "from-amber-100 to-orange-100",
      iconBg: "bg-amber-400",
      iconColor: "text-amber-900",
    },
    {
      title: "Revenus",
      value: `${stats.totalRevenue.toFixed(0)} €`,
      description: "factures payées",
      icon: FileText,
      gradient: "from-rose-100 to-pink-100",
      iconBg: "bg-rose-400",
      iconColor: "text-rose-900",
    },
  ];

  const displayStats = role === 'super_admin' ? adminStats : studentTeacherStats;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            {getGreeting()} ! 👋
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Bienvenue sur votre espace {getRoleTitle()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-2 border-gray-900 hover:shadow-xl transition-all">
                <CardContent className={`p-6 bg-gradient-to-br ${stat.gradient}`}>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</h3>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-700 font-medium">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-2 border-gray-900 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-tl-blue-lighter to-sky-50 border-b-2 border-gray-900">
            <CardTitle className="text-2xl font-black text-tl-blue">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 font-medium">
              {role === 'super_admin' 
                ? "Supervision de l'activité de la plateforme"
                : "Votre activité récente apparaîtra ici"
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
