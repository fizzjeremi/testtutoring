import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, User, Target, Settings, Shield, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AideTab from "@/components/profile/AideTab";
import { UserRole } from "@/hooks/useUserRole";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    level: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate("/login");
        return;
      }
      setUser(authUser);

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();
      setProfile(profileData);

      const { data: metricsData } = await supabase
        .from("user_metrics")
        .select("*")
        .eq("user_id", authUser.id)
        .single();
      setMetrics(metricsData);

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .single();
      if (roleData) {
        setCurrentRole(roleData.role as UserRole);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Tes modifications ont été sauvegardées",
      });
      
      loadUserData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const updateMetrics = async (updates: any) => {
    try {
      const { error } = await supabase
        .from("user_metrics")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Objectifs mis à jour",
        description: "Tes préférences ont été sauvegardées",
      });
      
      loadUserData();
    } catch (error) {
      console.error("Error updating metrics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les objectifs",
        variant: "destructive",
      });
    }
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      // Delete existing role
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user.id);

      // Insert new role
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: newRole });

      if (error) throw error;

      setCurrentRole(newRole);
      
      toast({
        title: "Rôle changé",
        description: `Vous êtes maintenant en mode ${newRole}`,
      });

      // Refresh the page to update navigation
      window.location.reload();
    } catch (error) {
      console.error("Error switching role:", error);
      toast({
        title: "Erreur",
        description: "Impossible de changer de rôle",
        variant: "destructive",
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: contactForm
      });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Notre équipe vous répondra dans les plus brefs délais",
      });
      
      setContactForm({
        name: "",
        email: "",
        level: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-2xl font-bold text-gray-600">Chargement...</div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-black text-gray-900">Mon Profil</h1>
            <p className="text-gray-600 mt-1">Gère ton compte et tes préférences</p>
          </div>
        </div>

        <Tabs defaultValue="profil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 border-2 border-gray-900">
            <TabsTrigger value="profil">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="objectifs">
              <Target className="w-4 h-4 mr-2" />
              Objectifs
            </TabsTrigger>
            <TabsTrigger value="aide">
              <Shield className="w-4 h-4 mr-2" />
              Aide
            </TabsTrigger>
            <TabsTrigger value="parametres">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
            <TabsTrigger value="compte">
              <Shield className="w-4 h-4 mr-2" />
              Compte
            </TabsTrigger>
          </TabsList>

          {/* Profil */}
          <TabsContent value="profil">
            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mets à jour tes informations de profil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profile?.first_name || ""}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="border-2 border-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Classe</Label>
                  <Select
                    value={profile?.current_level || ""}
                    onValueChange={(value) => updateProfile({ current_level: value })}
                  >
                    <SelectTrigger className="border-2 border-gray-900">
                      <SelectValue placeholder="Sélectionne ta classe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3e">3ème</SelectItem>
                      <SelectItem value="2nde">2nde</SelectItem>
                      <SelectItem value="1re">1ère</SelectItem>
                      <SelectItem value="term">Terminale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => updateProfile({ first_name: profile?.first_name })}
                  className="w-full bg-violet-600 hover:bg-violet-700 font-bold"
                >
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objectifs */}
          <TabsContent value="objectifs">
            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle>Tes objectifs d'apprentissage</CardTitle>
                <CardDescription>Personnalise ton expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Défi principal</Label>
                  <Select
                    value={profile?.main_challenge || ""}
                    onValueChange={(value) => updateProfile({ main_challenge: value })}
                  >
                    <SelectTrigger className="border-2 border-gray-900">
                      <SelectValue placeholder="Sélectionne ton défi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="structure">Structurer mes idées</SelectItem>
                      <SelectItem value="exemples">Trouver des exemples</SelectItem>
                      <SelectItem value="oral">Préparer l'oral</SelectItem>
                      <SelectItem value="comprendre">Comprendre les méthodes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Objectif hebdomadaire : {metrics?.weekly_goal || 3} sessions</Label>
                  <Slider
                    value={[metrics?.weekly_goal || 3]}
                    onValueChange={([value]) => setMetrics({ ...metrics, weekly_goal: value })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Choisis combien de fois tu veux travailler cette semaine
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus">Focus actuel</Label>
                  <Input
                    id="focus"
                    value={metrics?.current_focus || ""}
                    onChange={(e) => setMetrics({ ...metrics, current_focus: e.target.value })}
                    placeholder="Ex: La dissertation"
                    className="border-2 border-gray-900"
                  />
                </div>

                <Button 
                  onClick={() => updateMetrics({ 
                    weekly_goal: metrics?.weekly_goal,
                    current_focus: metrics?.current_focus 
                  })}
                  className="w-full bg-violet-600 hover:bg-violet-700 font-bold"
                >
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aide */}
          <TabsContent value="aide">
            <AideTab
              contactForm={contactForm}
              setContactForm={setContactForm}
              handleContactSubmit={handleContactSubmit}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          {/* Paramètres */}
          <TabsContent value="parametres">
            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle>Paramètres de l'application</CardTitle>
                <CardDescription>Configure ton expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-gray-600">Reçois des rappels et conseils</p>
                  </div>
                  <Button variant="outline" className="border-2 border-gray-900">
                    Activer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode sombre</Label>
                    <p className="text-sm text-gray-600">Thème d'affichage</p>
                  </div>
                  <Button variant="outline" className="border-2 border-gray-900">
                    Prochainement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compte */}
          <TabsContent value="compte">
            <div className="space-y-6">
              <Card className="border-2 border-gray-900">
                <CardHeader>
                  <CardTitle>Gestion du compte</CardTitle>
                  <CardDescription>Paramètres de sécurité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="border-2 border-gray-900 bg-gray-50"
                    />
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full border-2 border-gray-900 font-bold"
                  >
                    Changer le mot de passe
                  </Button>

                  <div className="pt-6 border-t-2 border-gray-200">
                    <Button 
                      variant="destructive"
                      className="w-full font-bold"
                    >
                      Supprimer mon compte
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Cette action est irréversible
                    </p>
                  </div>
                </CardContent>
              </Card>

              {user?.email === "jeremi.nawawi@gmail.com" && (
                <Card className="border-2 border-tl-blue bg-gradient-to-r from-tl-blue-lighter to-sky-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-tl-blue">
                      <Shield className="w-5 h-5" />
                      Changement de Vue (Admin)
                    </CardTitle>
                    <CardDescription>
                      Rôle actuel: <span className="font-bold capitalize">{currentRole?.replace('_', ' ')}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => switchRole("student")}
                        variant={currentRole === "student" ? "default" : "outline"}
                        className={`font-semibold border-2 border-gray-900 ${
                          currentRole === "student" 
                            ? "bg-tl-blue text-white" 
                            : "hover:bg-tl-blue-lighter"
                        }`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Élève
                      </Button>
                      
                      <Button
                        onClick={() => switchRole("parent")}
                        variant={currentRole === "parent" ? "default" : "outline"}
                        className={`font-semibold border-2 border-gray-900 ${
                          currentRole === "parent" 
                            ? "bg-tl-blue text-white" 
                            : "hover:bg-tl-blue-lighter"
                        }`}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Parent
                      </Button>
                      
                      <Button
                        onClick={() => switchRole("teacher")}
                        variant={currentRole === "teacher" ? "default" : "outline"}
                        className={`font-semibold border-2 border-gray-900 ${
                          currentRole === "teacher" 
                            ? "bg-tl-blue text-white" 
                            : "hover:bg-tl-blue-lighter"
                        }`}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Professeur
                      </Button>
                      
                      <Button
                        onClick={() => switchRole("super_admin")}
                        variant={currentRole === "super_admin" ? "default" : "outline"}
                        className={`font-semibold border-2 border-gray-900 ${
                          currentRole === "super_admin" 
                            ? "bg-tl-blue text-white" 
                            : "hover:bg-tl-blue-lighter"
                        }`}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Super Admin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
