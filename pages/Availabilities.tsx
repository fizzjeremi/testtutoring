import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Clock } from "lucide-react";

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const Availabilities = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const { toast } = useToast();

  const daysOfWeek = [
    { value: "1", label: "Lundi" },
    { value: "2", label: "Mardi" },
    { value: "3", label: "Mercredi" },
    { value: "4", label: "Jeudi" },
    { value: "5", label: "Vendredi" },
    { value: "6", label: "Samedi" },
    { value: "0", label: "Dimanche" },
  ];

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (teacherData) {
        setTeacherId(teacherData.id);
        loadAvailabilities(teacherData.id);
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailabilities = async (tId: string) => {
    try {
      const { data, error } = await supabase
        .from('availabilities')
        .select('*')
        .eq('teacher_id', tId)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setAvailabilities(data || []);
    } catch (error) {
      console.error('Error loading availabilities:', error);
    }
  };

  const handleAdd = async () => {
    if (!teacherId) return;

    try {
      const { error } = await supabase
        .from('availabilities')
        .insert({
          teacher_id: teacherId,
          day_of_week: parseInt(dayOfWeek),
          start_time: startTime,
          end_time: endTime,
        });

      if (error) throw error;

      toast({
        title: "Disponibilité ajoutée",
        description: "Votre créneau a été ajouté avec succès",
      });

      loadAvailabilities(teacherId);
    } catch (error) {
      console.error('Error adding availability:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la disponibilité",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('availabilities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Disponibilité supprimée",
        description: "Le créneau a été supprimé",
      });

      setAvailabilities(availabilities.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la disponibilité",
        variant: "destructive",
      });
    }
  };

  const getDayLabel = (day: number) => {
    return daysOfWeek.find(d => d.value === day.toString())?.label || '';
  };

  const groupedAvailabilities = availabilities.reduce((acc, avail) => {
    const day = avail.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(avail);
    return acc;
  }, {} as Record<number, Availability[]>);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Mes disponibilités</h1>
          <p className="text-gray-600 mt-2">Définissez vos créneaux disponibles pour les cours</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Ajouter une disponibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Jour</label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Début</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fin</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleAdd} className="w-full bg-[#1F2A74]">
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Mes créneaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : Object.keys(groupedAvailabilities).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune disponibilité définie</p>
              </div>
            ) : (
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const dayAvailabilities = groupedAvailabilities[parseInt(day.value)];
                  if (!dayAvailabilities) return null;

                  return (
                    <div key={day.value} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-3">{day.label}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dayAvailabilities.map((avail) => (
                          <div
                            key={avail.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium">
                                {avail.start_time.slice(0, 5)} - {avail.end_time.slice(0, 5)}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(avail.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Availabilities;
