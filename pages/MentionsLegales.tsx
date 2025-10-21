import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const MentionsLegales = () => {
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
          <h1 className="text-4xl font-black text-gray-900 mb-6">Mentions légales</h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Éditeur du site</h2>
              <p>
                <strong>Tutoring London International</strong><br />
                Organisme d'enseignement international<br />
                Site web : <a href="https://www.tutoringlondon.co.uk/en" className="text-[#1F2A74] hover:underline">www.tutoringlondon.co.uk</a><br />
                Email : contact@tutoringlondon.co.uk
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Hébergement</h2>
              <p>
                Le site BacFrançais est hébergé sur une infrastructure cloud sécurisée.<br />
                Les données sont traitées conformément au RGPD.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur BacFrançais (textes, images, vidéos, design) 
                est la propriété exclusive de Tutoring London International, sauf mention contraire.<br />
                Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Responsabilité</h2>
              <p>
                Tutoring London International s'efforce de fournir des informations exactes et à jour. 
                Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des 
                informations mises à disposition sur le site.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MentionsLegales;
