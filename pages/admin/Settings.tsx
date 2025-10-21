import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Eye, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/hooks/useUserRole";

const Settings = () => {
  const [userData, setUserData] = useState<{ email: string; role: UserRole | null }>({
    email: "",
    role: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        setUserData({
          email: user.email || "",
          role: roleData?.role as UserRole || null,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Utilisateur non authentifié");
        return;
      }

      // Delete existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: newRole });

      if (error) {
        toast.error("Erreur lors du changement de rôle");
        console.error(error);
        return;
      }

      toast.success(`Vue changée en ${newRole}`);
      
      // Reload the page to apply the new role
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error("Erreur lors du changement de rôle");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
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
          <h1 className="text-4xl font-black text-gray-900">Profil Super Admin</h1>
          <p className="text-gray-600 mt-2">Gérez votre profil et changez de vue</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="view-switcher">
              <Eye className="w-4 h-4 mr-2" />
              Changement de Vue
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Rôle actuel</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                    <p className="text-gray-900 font-semibold">{userData.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="view-switcher" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Changement de Vue (Super Admin)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  En tant que super admin, vous pouvez voir l'application du point de vue de différents rôles.
                  Sélectionnez un rôle ci-dessous pour changer votre vue actuelle.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={userData.role === 'student' ? 'default' : 'outline'}
                    onClick={() => switchRole('student')}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Vue Élève</span>
                  </Button>
                  
                  <Button
                    variant={userData.role === 'teacher' ? 'default' : 'outline'}
                    onClick={() => switchRole('teacher')}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Vue Professeur</span>
                  </Button>
                  
                  <Button
                    variant={userData.role === 'parent' ? 'default' : 'outline'}
                    onClick={() => switchRole('parent')}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Vue Parent</span>
                  </Button>
                  
                  <Button
                    variant={userData.role === 'super_admin' ? 'default' : 'outline'}
                    onClick={() => switchRole('super_admin')}
                    className="h-20 flex flex-col items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Vue Admin</span>
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Le changement de vue rechargera automatiquement la page et vous verrez
                    l'interface correspondant au rôle sélectionné.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SettingsIcon className="w-5 h-5 mr-2" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Les paramètres de la plateforme seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
