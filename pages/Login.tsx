import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState<'student' | 'parent' | 'super_admin'>('student');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && !firstName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre prénom",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        // Sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: firstName,
            },
          },
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error('User creation failed');

        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Assign role using secure function
        const { error: roleError } = await supabase.rpc('assign_user_role', {
          _user_id: signUpData.user.id,
          _role: role
        });

        if (roleError) {
          console.error('Role assignment error:', roleError);
          throw roleError;
        }

        // Create role-specific profile
        if (role === 'student') {
          await supabase.from('students').upsert({ 
            user_id: signUpData.user.id,
            grade_level: 'Terminale',
          });
        } else if (role === 'parent') {
          await supabase.from('parents').upsert({ 
            user_id: signUpData.user.id,
            phone: '',
          });
        }

        // Sign in after account creation
        const { error: finalSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (finalSignInError) throw finalSignInError;

        toast({
          title: "Compte créé",
          description: `Bienvenue ${firstName} !`,
        });

        navigate('/dashboard');
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (!data.user) throw new Error('Login failed');

        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });

        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isSignUp ? "Erreur d'inscription" : "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-gray-900">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-tl-blue-lighter to-sky-50 border-b-2 border-gray-900">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-3xl font-black text-tl-blue">Tutoring London</h1>
          </Link>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-semibold">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={isSignUp}
                  className="border-2 border-gray-200 focus:border-tl-blue"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 border-gray-200 focus:border-tl-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-2 border-gray-200 focus:border-tl-blue"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="role" className="font-semibold">Rôle</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-tl-blue">
                    <SelectValue placeholder="Sélectionnez votre rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Élève</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="super_admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-tl-blue hover:bg-tl-blue/90 font-bold text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                isSignUp ? "S'inscrire" : "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-tl-blue hover:underline font-semibold"
            >
              {isSignUp 
                ? "Déjà un compte ? Se connecter" 
                : "Pas de compte ? S'inscrire"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline font-medium">
              Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
