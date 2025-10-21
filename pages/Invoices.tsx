import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { FileText } from "lucide-react";
import InvoiceCard from "@/components/invoices/InvoiceCard";
import InvoiceGenerator from "@/components/invoices/InvoiceGenerator";

interface Invoice {
  id: string;
  invoice_number: string;
  start_period: string;
  end_period: string;
  amount: number;
  status: string;
  pdf_url: string | null;
  created_at: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      // For parents, filter by their ID
      if (role === 'parent') {
        const { data: parentData } = await supabase
          .from('parents')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (parentData) {
          query = query.eq('parent_id', parentData.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (id: string) => {
    toast({
      title: "Téléchargement",
      description: "Le PDF sera disponible prochainement",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Factures</h1>
            <p className="text-gray-600 mt-2">Consultez et téléchargez vos factures</p>
          </div>
          {role === 'super_admin' && <InvoiceGenerator onGenerated={loadInvoices} />}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Historique des factures
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Chargement...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune facture disponible pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <InvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Invoices;
