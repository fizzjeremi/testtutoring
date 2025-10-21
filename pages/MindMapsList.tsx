import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MindMap {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const MindMapsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMapTitle, setNewMapTitle] = useState("");
  const [showNewMapDialog, setShowNewMapDialog] = useState(false);
  const [deleteMapId, setDeleteMapId] = useState<string | null>(null);

  useEffect(() => {
    loadMindMaps();
  }, []);

  const loadMindMaps = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("mind_maps")
        .select("id, title, created_at, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setMindMaps(data || []);
    } catch (error) {
      console.error("Error loading mind maps:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cartes mentales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMindMap = async () => {
    if (!newMapTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("mind_maps")
        .insert({
          user_id: user.id,
          title: newMapTitle,
          nodes: [{ id: "1", text: newMapTitle, x: 400, y: 300, color: "#8b5cf6" }],
          connections: [],
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Carte mentale créée !",
      });

      setNewMapTitle("");
      setShowNewMapDialog(false);
      navigate(`/carte-mentale/${data.id}`);
    } catch (error) {
      console.error("Error creating mind map:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la carte mentale",
        variant: "destructive",
      });
    }
  };

  const deleteMindMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from("mind_maps")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Carte mentale supprimée",
      });

      loadMindMaps();
    } catch (error) {
      console.error("Error deleting mind map:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la carte mentale",
        variant: "destructive",
      });
    }
    setDeleteMapId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
              <h1 className="text-3xl font-black text-gray-900">Mes cartes mentales</h1>
              <p className="text-gray-600">Organise visuellement tes connaissances</p>
            </div>
          </div>

          <Button
            onClick={() => setShowNewMapDialog(true)}
            className="bg-violet-600 hover:bg-violet-700 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle carte
          </Button>
        </div>

        {/* Grid of mind maps */}
        {mindMaps.length === 0 ? (
          <Card className="border-2 border-gray-900 p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucune carte mentale
            </h3>
            <p className="text-gray-600 mb-6">
              Crée ta première carte mentale pour commencer à organiser tes révisions
            </p>
            <Button
              onClick={() => setShowNewMapDialog(true)}
              className="bg-violet-600 hover:bg-violet-700 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer ma première carte
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mindMaps.map((map) => (
              <Card
                key={map.id}
                className="border-2 border-gray-900 hover:shadow-xl transition-all cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-black text-gray-900 flex-1">
                      {map.title}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/carte-mentale/${map.id}`);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteMapId(map.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p>Créée le {new Date(map.created_at).toLocaleDateString("fr-FR")}</p>
                    <p>Modifiée le {new Date(map.updated_at).toLocaleDateString("fr-FR")}</p>
                  </div>

                  <Button
                    onClick={() => navigate(`/carte-mentale/${map.id}`)}
                    className="w-full bg-violet-600 hover:bg-violet-700 font-bold"
                  >
                    Ouvrir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* New Map Dialog */}
        <AlertDialog open={showNewMapDialog} onOpenChange={setShowNewMapDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Nouvelle carte mentale</AlertDialogTitle>
              <AlertDialogDescription>
                Donne un titre à ta nouvelle carte mentale
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              value={newMapTitle}
              onChange={(e) => setNewMapTitle(e.target.value)}
              placeholder="Ex: Bac Français 2025"
              className="border-2 border-gray-900"
              onKeyDown={(e) => e.key === "Enter" && createMindMap()}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={createMindMap}>Créer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteMapId} onOpenChange={() => setDeleteMapId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette carte ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les données de cette carte seront perdues.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMapId && deleteMindMap(deleteMapId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MindMapsList;
