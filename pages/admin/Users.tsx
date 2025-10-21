import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users as UsersIcon, Search, Plus } from "lucide-react";

interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  profile?: {
    first_name: string;
  };
  role?: {
    role: string;
  };
}

const Users = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, first_name');

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Get auth users (admin only - would need service role key in production)
      // For demo, we'll just show profiles with their roles
      const usersData = profiles?.map(profile => ({
        id: profile.user_id,
        email: `user-${profile.user_id.slice(0, 8)}@demo.com`,
        created_at: new Date().toISOString(),
        profile: {
          first_name: profile.first_name,
        },
        role: roles?.find(r => r.user_id === profile.user_id),
      })) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return <Badge variant="outline">Aucun rôle</Badge>;

    const styles = {
      student: "bg-blue-100 text-blue-800",
      teacher: "bg-green-100 text-green-800",
      parent: "bg-purple-100 text-purple-800",
      super_admin: "bg-red-100 text-red-800",
    };

    const labels = {
      student: "Élève",
      teacher: "Professeur",
      parent: "Parent",
      super_admin: "Admin",
    };

    return (
      <Badge className={styles[role as keyof typeof styles]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => 
    user.profile?.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Utilisateurs</h1>
            <p className="text-gray-600 mt-2">Gérez tous les comptes de la plateforme</p>
          </div>
          <Button className="bg-[#1F2A74] hover:bg-[#1F2A74]/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2" />
                Tous les utilisateurs
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Rôle</th>
                      <th className="text-left py-3 px-4 font-semibold">Inscription</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {user.profile?.first_name || 'Non défini'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(user.role?.role)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
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

export default Users;
