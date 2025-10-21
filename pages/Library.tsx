import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, BookOpen, FileText, Video, Headphones, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  content: string | null;
  tags: string[] | null;
  difficulty: string | null;
  duration_minutes: number | null;
  created_at: string;
}

interface UserResource {
  resource_id: string;
  status: string;
  progress: number;
  last_accessed: string | null;
}

const Library = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [userResources, setUserResources] = useState<Map<string, UserResource>>(new Map());
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
    loadUserResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchQuery, activeType, activeDifficulty]);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ressources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserResources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_resources")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const map = new Map<string, UserResource>();
      data?.forEach(ur => {
        map.set(ur.resource_id, ur);
      });
      setUserResources(map);
    } catch (error) {
      console.error("Error loading user resources:", error);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (activeType !== "all") {
      filtered = filtered.filter(r => r.type === activeType);
    }

    if (activeDifficulty !== "all") {
      filtered = filtered.filter(r => r.difficulty === activeDifficulty);
    }

    setFilteredResources(filtered);
  };

  const getResourceIcon = (type: string) => {
    const icons: Record<string, any> = {
      methodologie: BookOpen,
      fiche: FileText,
      exercice: Video,
      correction: Headphones,
    };
    return icons[type] || BookOpen;
  };

  const getResourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      methodologie: "Méthodologie",
      fiche: "Fiche",
      exercice: "Exercice",
      correction: "Correction",
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string | null) => {
    if (!difficulty) return "secondary";
    const colors: Record<string, string> = {
      debutant: "success",
      moyen: "warning",
      avance: "destructive",
    };
    return colors[difficulty] || "secondary";
  };

  const getDifficultyLabel = (difficulty: string | null) => {
    if (!difficulty) return "";
    const labels: Record<string, string> = {
      debutant: "Débutant",
      moyen: "Intermédiaire",
      avance: "Avancé",
    };
    return labels[difficulty] || difficulty;
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/ressources/${resourceId}`);
  };

  const resourceTypes = ["all", "methodologie", "fiche", "exercice", "correction"];
  const difficulties = ["all", "debutant", "moyen", "avance"];

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
            <h1 className="text-4xl font-black text-gray-900">Bibliothèque de ressources</h1>
            <p className="text-gray-600 mt-1">Découvre tous les contenus pour progresser</p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par titre, description ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-2 border-gray-900 rounded-xl text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">Type de contenu</p>
              <Tabs value={activeType} onValueChange={setActiveType}>
                <TabsList className="grid w-full grid-cols-5 h-auto border-2 border-gray-900">
                  {resourceTypes.map(type => (
                    <TabsTrigger key={type} value={type} className="py-2">
                      {type === "all" ? "Tous" : getResourceTypeLabel(type)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700 mb-2">Niveau</p>
              <Tabs value={activeDifficulty} onValueChange={setActiveDifficulty}>
                <TabsList className="grid w-full grid-cols-4 h-auto border-2 border-gray-900">
                  {difficulties.map(diff => (
                    <TabsTrigger key={diff} value={diff} className="py-2">
                      {diff === "all" ? "Tous" : getDifficultyLabel(diff)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="border-2 border-gray-900 animate-pulse">
                <CardHeader className="h-32 bg-gray-200" />
                <CardContent className="h-24 bg-gray-100" />
              </Card>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <Card className="border-2 border-gray-900 text-center p-12">
            <p className="text-2xl font-bold text-gray-600 mb-2">Aucune ressource trouvée</p>
            <p className="text-gray-500">Essaie de modifier tes filtres ou ta recherche</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => {
              const Icon = getResourceIcon(resource.type);
              const userResource = userResources.get(resource.id);
              const progress = userResource?.progress || 0;
              const status = userResource?.status || "not_started";

              return (
                <Card
                  key={resource.id}
                  className="border-2 border-gray-900 hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                  onClick={() => handleResourceClick(resource.id)}
                >
                  <CardHeader className="bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="font-bold border-2 border-gray-900">
                        <Icon className="w-3 h-3 mr-1" />
                        {getResourceTypeLabel(resource.type)}
                      </Badge>
                      
                      {resource.difficulty && (
                        <Badge variant={getDifficultyColor(resource.difficulty) as any} className="border-2 border-gray-900">
                          {getDifficultyLabel(resource.difficulty)}
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl font-black text-gray-900 line-clamp-2">
                      {resource.title}
                    </CardTitle>
                    
                    {resource.description && (
                      <CardDescription className="line-clamp-2 text-gray-700">
                        {resource.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {resource.duration_minutes && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{resource.duration_minutes} min</span>
                        </div>
                      )}

                      {progress > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-semibold text-gray-700 flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              Progression
                            </span>
                            <span className="font-bold text-violet-600">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {resource.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-gray-900">
                              {tag}
                            </Badge>
                          ))}
                          {resource.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-900">
                              +{resource.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
