import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const ConditionsUtilisation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="max-w-4xl mx-auto bg-white border-2 border-gray-900 rounded-3xl p-8">
          <h1 className="text-4xl font-black text-gray-900 mb-6">Conditions d'utilisation</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Acceptation des conditions</h2>
              <p>
                En utilisant BacFrançais, vous acceptez les présentes conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Objet du service</h2>
              <p>
                BacFrançais est une plateforme éducative développée par Tutoring London International 
                pour accompagner les élèves dans leur préparation au Bac de français. 
                Le service comprend :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Un coach IA adaptatif</li>
                <li>Des ressources pédagogiques</li>
                <li>Des outils de révision et de mémorisation</li>
                <li>Un suivi de progression personnalisé</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Compte utilisateur</h2>
              <p>
                Pour utiliser BacFrançais, vous devez créer un compte. Vous êtes responsable :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>De la confidentialité de vos identifiants</li>
                <li>De l'exactitude des informations fournies</li>
                <li>De toutes les activités effectuées depuis votre compte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Utilisation acceptable</h2>
              <p>
                Vous vous engagez à utiliser BacFrançais de manière légale et éthique. 
                Il est notamment interdit de :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Partager vos identifiants avec des tiers</li>
                <li>Utiliser le service à des fins commerciales sans autorisation</li>
                <li>Reproduire ou diffuser les contenus sans permission</li>
                <li>Tenter d'accéder aux systèmes de manière non autorisée</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Propriété intellectuelle</h2>
              <p>
                Tous les contenus de BacFrançais (textes, vidéos, exercices, interface) 
                sont protégés par le droit d'auteur et restent la propriété de Tutoring London International.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Limitation de responsabilité</h2>
              <p>
                BacFrançais est un outil d'accompagnement pédagogique. Tutoring London International 
                ne peut être tenu responsable des résultats obtenus aux examens. 
                Le service est fourni "en l'état" sans garantie de disponibilité permanente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Modification des conditions</h2>
              <p>
                Tutoring London International se réserve le droit de modifier les présentes conditions 
                à tout moment. Les utilisateurs seront informés des changements importants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
              <p>
                Pour toute question concernant ces conditions d'utilisation, contactez-nous à : 
                <a href="mailto:contact@tutoringlondon.co.uk" className="text-[#1F2A74] hover:underline ml-1">
                  contact@tutoringlondon.co.uk
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConditionsUtilisation;
