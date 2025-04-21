
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TemplateSubmissionForm } from "@/components/marketplace/TemplateSubmissionForm";
import { PartnerTemplateListing } from "./PartnerTemplateListing";
import { PartnerStats } from "./PartnerStats";

export function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("templates");
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("template_categories")
          .select("name")
          .order("name");
          
        if (error) throw error;
        
        setCategories(data.map(cat => cat.name));
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast({
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar as categorias de templates.",
          variant: "destructive",
        });
      }
    }
    
    loadCategories();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="templates">Meus Templates</TabsTrigger>
            <TabsTrigger value="stats">Métricas e Vendas</TabsTrigger>
            <TabsTrigger value="payouts">Pagamentos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => setIsSubmissionFormOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>
      
      <TabsContent value="templates" className="mt-6">
        <PartnerTemplateListing partnerId={user?.id} />
      </TabsContent>
      
      <TabsContent value="stats" className="mt-6">
        <PartnerStats partnerId={user?.id} />
      </TabsContent>
      
      <TabsContent value="payouts" className="mt-6">
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-medium mb-4">Histórico de Pagamentos</h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              O sistema de pagamentos para parceiros está em desenvolvimento.
            </p>
            <p className="text-sm">
              Em breve você poderá acompanhar seus ganhos e solicitar saques.
            </p>
          </div>
        </div>
      </TabsContent>
      
      <TemplateSubmissionForm
        isOpen={isSubmissionFormOpen}
        onClose={() => setIsSubmissionFormOpen(false)}
        categories={categories}
        isPartnerSubmission={true}
      />
    </div>
  );
}
