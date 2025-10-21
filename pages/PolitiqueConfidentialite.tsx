import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
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
          <h1 className="text-4xl font-black text-gray-900 mb-6">Politique de confidentialité</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Collecte des données</h2>
              <p>
                BacFrançais collecte uniquement les données nécessaires au fonctionnement 
                de la plateforme éducative :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Informations de compte (prénom, email)</li>
                <li>Niveau scolaire et préférences d'apprentissage</li>
                <li>Historique d'utilisation et progrès pédagogiques</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Utilisation des données</h2>
              <p>
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Personnaliser votre expérience d'apprentissage</li>
                <li>Suivre vos progrès et adapter les contenus</li>
                <li>Améliorer nos services éducatifs</li>
              </ul>
              <p className="mt-3">
                <strong>Nous ne vendons jamais vos données à des tiers.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sécurité</h2>
              <p>
                Vos données sont stockées sur des serveurs sécurisés et chiffrés. 
                Nous mettons en œuvre toutes les mesures techniques nécessaires pour 
                protéger vos informations personnelles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Vos droits (RGPD)</h2>
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD), 
                vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit d'opposition</li>
                <li>Droit à la portabilité</li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez-nous à : 
                <a href="mailto:contact@tutoringlondon.co.uk" className="text-[#1F2A74] hover:underline ml-1">
                  contact@tutoringlondon.co.uk
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Cookies</h2>
              <p>
                BacFrançais utilise des cookies essentiels au fonctionnement de la plateforme 
                (authentification, préférences). Aucun cookie de tracking publicitaire n'est utilisé.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
