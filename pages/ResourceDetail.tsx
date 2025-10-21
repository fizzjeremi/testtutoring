import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, BookOpen, Clock, TrendingUp, CheckCircle, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string | null;
  tags: string[] | null;
  difficulty: string | null;
  duration_minutes: number | null;
}

interface UserResource {
  id: string;
  status: string;
  progress: number;
  last_accessed: string | null;
}

const ResourceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resource, setResource] = useState<Resource | null>(null);
  const [userResource, setUserResource] = useState<UserResource | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResource();
      loadUserResource();
      markAsAccessed();
    }
  }, [id]);

  const loadResource = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setResource(data);
    } catch (error) {
      console.error("Error loading resource:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la ressource",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserResource = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_resources")
        .select("*")
        .eq("user_id", user.id)
        .eq("resource_id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserResource(data);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Error loading user resource:", error);
    }
  };

  const markAsAccessed = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !id) return;

      const { data: existing } = await supabase
        .from("user_resources")
        .select("id")
        .eq("user_id", user.id)
        .eq("resource_id", id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_resources")
          .update({ last_accessed: new Date().toISOString() })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("user_resources")
          .insert({
            user_id: user.id,
            resource_id: id,
            status: "in_progress",
            progress: 0,
            last_accessed: new Date().toISOString(),
          });
        loadUserResource();
      }
    } catch (error) {
      console.error("Error marking resource as accessed:", error);
    }
  };

  const updateProgress = async (newProgress: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !id) return;

      const status = newProgress === 100 ? "completed" : "in_progress";

      if (userResource) {
        await supabase
          .from("user_resources")
          .update({ 
            progress: newProgress, 
            status,
            last_accessed: new Date().toISOString() 
          })
          .eq("id", userResource.id);

        setUserResource({ ...userResource, progress: newProgress, status });
        
        if (newProgress === 100) {
          toast({
            title: "🎉 Bravo !",
            description: "Tu as terminé cette ressource !",
          });
        }
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder ta progression",
        variant: "destructive",
      });
    }
  };

  const markAsComplete = () => {
    setProgress(100);
    updateProgress(100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Card className="border-2 border-gray-900 max-w-md text-center p-8">
          <p className="text-2xl font-bold text-gray-900 mb-4">Ressource introuvable</p>
            <Button
              variant="ghost"
              onClick={() => navigate("/bibliotheque")}
            >
              Retour aux ressources
            </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/bibliotheque")}
          className="mb-6 border-2 border-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-900">
              <CardHeader className="bg-gradient-to-br from-violet-100 to-purple-100">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="border-2 border-gray-900 font-bold">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {resource.type}
                  </Badge>
                  
                  {resource.difficulty && (
                    <Badge variant="outline" className="border-2 border-gray-900">
                      {resource.difficulty}
                    </Badge>
                  )}
                  
                  {resource.duration_minutes && (
                    <Badge variant="outline" className="border-2 border-gray-900">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.duration_minutes} min
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-3xl font-black text-gray-900">
                  {resource.title}
                </CardTitle>
                
                {resource.description && (
                  <CardDescription className="text-base text-gray-700 mt-2">
                    {resource.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 border-2 border-gray-900">
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    <TabsTrigger value="notes">Mes notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-6">
                    {resource.content ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {resource.content}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">Contenu à venir</p>
                        <p className="text-sm">Cette ressource sera bientôt disponible</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="notes" className="mt-6">
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg font-semibold mb-2">Fonctionnalité à venir</p>
                      <p className="text-sm">Tu pourras bientôt prendre des notes ici</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-900 sticky top-8">
              <CardHeader className="bg-gradient-to-br from-green-100 to-emerald-100">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Ma progression
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Avancement</span>
                    <span className="text-2xl font-black text-violet-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 mb-4" />
                  
                  <Slider
                    value={[progress]}
                    onValueChange={([value]) => setProgress(value)}
                    onValueCommit={([value]) => updateProgress(value)}
                    max={100}
                    step={10}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Déplace le curseur pour mettre à jour ta progression
                  </p>
                </div>

                {progress < 100 && (
                  <Button 
                    onClick={markAsComplete}
                    className="w-full bg-green-600 hover:bg-green-700 font-bold"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marquer comme terminé
                  </Button>
                )}

                {progress === 100 && (
                  <div className="bg-green-100 border-2 border-green-600 rounded-lg p-4 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800">Ressource terminée !</p>
                  </div>
                )}

                {resource.tags && resource.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="border-gray-900">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
