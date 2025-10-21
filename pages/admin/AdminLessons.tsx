import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface Lesson {
  id: string;
  subject: string;
  start_at: string;
  end_at: string;
  status: string;
  meeting_link: string | null;
  teacher_id: string;
  student_id: string;
}

const AdminLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('start_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-green-100 text-green-800",
      requested: "bg-yellow-100 text-yellow-800",
      canceled: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800",
    };

    const labels = {
      confirmed: "Confirmé",
      requested: "En attente",
      canceled: "Annulé",
      completed: "Terminé",
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Tous les cours</h1>
          <p className="text-gray-600 mt-2">Supervision de toutes les sessions de tutorat</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Sessions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucun cours enregistré</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Date & Heure</th>
                      <th className="text-left py-3 px-4 font-semibold">Matière</th>
                      <th className="text-left py-3 px-4 font-semibold">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold">Lien visio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {format(new Date(lesson.start_at), "EEE d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {lesson.subject}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(lesson.status)}
                        </td>
                        <td className="py-3 px-4">
                          {lesson.meeting_link ? (
                            <a
                              href={lesson.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1F2A74] hover:underline"
                            >
                              Accéder
                            </a>
                          ) : (
                            <span className="text-gray-400">Non défini</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminLessons;
