import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Shield, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/hooks/useUserRole";

const TutoringProfile = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      
      setUser(authUser);

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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-900 font-semibold text-lg">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez votre compte et vos préférences</p>
        </div>

        <Tabs defaultValue="compte" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 border-2 border-gray-900">
            <TabsTrigger value="compte">
              <User className="w-4 h-4 mr-2" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="parametres">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Compte */}
          <TabsContent value="compte">
            <div className="space-y-6">
              <Card className="border-2 border-gray-900">
                <CardHeader className="bg-gradient-to-r from-tl-blue-lighter to-sky-50 border-b-2 border-gray-900">
                  <CardTitle>Informations du compte</CardTitle>
                  <CardDescription>Vos informations personnelles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="border-2 border-gray-900 bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rôle actuel</Label>
                    <Input
                      value={currentRole?.replace('_', ' ').toUpperCase() || ""}
                      disabled
                      className="border-2 border-gray-900 bg-gray-50 capitalize"
                    />
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full border-2 border-gray-900 font-semibold hover:bg-tl-blue-lighter"
                  >
                    Changer le mot de passe
                  </Button>

                  <div className="pt-6 border-t-2 border-gray-200">
                    <Button 
                      variant="destructive"
                      className="w-full font-semibold"
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
                  <CardHeader className="border-b-2 border-tl-blue">
                    <CardTitle className="flex items-center gap-2 text-tl-blue">
                      <Shield className="w-5 h-5" />
                      Changement de Vue (Admin)
                    </CardTitle>
                    <CardDescription>
                      Rôle actuel: <span className="font-bold capitalize">{currentRole?.replace('_', ' ')}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => switchRole("student")}
                        variant={currentRole === "student" ? "default" : "outline"}
                        className={`font-semibold border-2 border-gray-900 ${
                          currentRole === "student" 
                            ? "bg-tl-blue text-white" 
                            : "hover:bg-white"
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
                            : "hover:bg-white"
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
                            : "hover:bg-white"
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
                            : "hover:bg-white"
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

          {/* Paramètres */}
          <TabsContent value="parametres">
            <Card className="border-2 border-gray-900">
              <CardHeader className="bg-gradient-to-r from-tl-blue-lighter to-sky-50 border-b-2 border-gray-900">
                <CardTitle>Paramètres de l'application</CardTitle>
                <CardDescription>Configurez votre expérience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Notifications par email</Label>
                    <p className="text-sm text-gray-600">Recevez des rappels et mises à jour</p>
                  </div>
                  <Button variant="outline" className="border-2 border-gray-900 font-semibold">
                    Activer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Fuseau horaire</Label>
                    <p className="text-sm text-gray-600">Europe/London</p>
                  </div>
                  <Button variant="outline" className="border-2 border-gray-900 font-semibold">
                    Modifier
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Langue</Label>
                    <p className="text-sm text-gray-600">Français</p>
                  </div>
                  <Button variant="outline" className="border-2 border-gray-900 font-semibold">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TutoringProfile;
