
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusIcon, PencilIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";
import { TemplateVersionModal } from "./TemplateVersionModal";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  status: string;
  version: string;
  created_at: string;
  installs: number;
}

interface PartnerTemplateListingProps {
  partnerId: string | undefined;
}

export function PartnerTemplateListing({ partnerId }: PartnerTemplateListingProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadTemplates() {
      if (!partnerId) return;
      
      try {
        setIsLoading(true);
        // Como não temos template_installs nos tipos definidos, vamos fazer uma abordagem simplificada
        const { data, error } = await supabase
          .from("automation_templates")
          .select(`
            id, 
            name, 
            description, 
            category, 
            is_premium, 
            status, 
            version, 
            created_at
          `)
          .eq("created_by_user", partnerId);
          
        if (error) throw error;
        
        if (data) {
          // Adicionar um valor simulado para installs por enquanto
          const formattedTemplates = data.map(template => ({
            ...template,
            installs: Math.floor(Math.random() * 100) // valor simulado para demonstração
          }));
          
          setTemplates(formattedTemplates);
        } else {
          setTemplates([]);
        }
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
        toast({
          title: "Erro ao carregar templates",
          description: "Não foi possível carregar seus templates.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTemplates();
  }, [partnerId, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Publicado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Em Análise</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Rascunho</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const handleNewVersion = (template: Template) => {
    setSelectedTemplate(template);
    setIsVersionModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border text-center">
        <h3 className="text-lg font-medium mb-4">Nenhum Template Encontrado</h3>
        <p className="text-muted-foreground mb-4">
          Você ainda não submeteu nenhum template ao marketplace.
        </p>
        <Button onClick={() => {}}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Criar Primeiro Template
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Instalações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">
                {template.name}
                {template.is_premium && (
                  <Badge className="ml-2 bg-yellow-500">Premium</Badge>
                )}
              </TableCell>
              <TableCell>{template.category}</TableCell>
              <TableCell>{template.version || "1.0.0"}</TableCell>
              <TableCell>{getStatusBadge(template.status)}</TableCell>
              <TableCell>{template.installs}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" title="Ver Detalhes">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    title="Editar Template"
                    disabled={template.status === "published"}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    title="Nova Versão"
                    onClick={() => handleNewVersion(template)}
                    disabled={template.status !== "published"}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TemplateVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}
