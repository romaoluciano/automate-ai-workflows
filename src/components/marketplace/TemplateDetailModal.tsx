
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserIcon, StarIcon, TagIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

interface TemplateVersionHistory {
  version: string;
  released_at: string;
  changelog: string;
}

interface TemplateDetailModalProps {
  template: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    tags: string[];
    autor: string;
    autorId?: string;
    premium: boolean;
    avaliacao: number;
    json_schema?: any;
    version?: string;
    preco?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateDetailModal({ template, isOpen, onClose }: TemplateDetailModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [versionHistory, setVersionHistory] = useState<TemplateVersionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadVersionHistory() {
      if (!template?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("automation_templates_versions" as any)
          .select("version, released_at, changelog")
          .eq("template_id", template.id)
          .order("released_at", { ascending: false });
          
        if (error) throw error;
        
        // Se não houver histórico, criar uma entrada com a versão atual
        if (!data || data.length === 0 && template.version) {
          setVersionHistory([{
            version: template.version,
            released_at: new Date().toISOString(),
            changelog: "Versão inicial"
          }]);
        } else {
          // Use type assertion to fix the conversion error
          setVersionHistory(data as unknown as TemplateVersionHistory[]);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico de versões:", error);
        setVersionHistory([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isOpen) {
      loadVersionHistory();
    }
  }, [template, isOpen]);

  const handleCloneTemplate = async () => {
    if (!template) return;

    try {
      if (!user) {
        toast({
          title: "Erro ao usar template",
          description: "Você precisa estar logado para usar este template.",
          variant: "destructive",
        });
        return;
      }
      
      // Para templates premium, verificar pagamento
      if (template.premium && template.preco && template.preco > 0) {
        // Aqui implementaríamos a verificação de pagamento
        // Por enquanto, apenas exibimos uma mensagem
        toast({
          title: "Template Premium",
          description: "Para usar este template, é necessário adquiri-lo primeiro.",
        });
        return;
      }

      const { data: automation, error } = await supabase
        .from("automations")
        .insert({
          name: `${template.nome} (Clone)`,
          description: template.descricao,
          json_schema: template.json_schema || {},
          is_active: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Registrar a instalação do template
      // Usamos "as any" até que os tipos sejam atualizados
      await supabase
        .from("template_installs" as any)
        .insert({
          template_id: template.id,
          user_id: user.id,
          version: template.version || "1.0.0"
        });

      toast({
        title: "Template clonado com sucesso!",
        description: "Você pode encontrar a nova automação na sua lista de automações.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro ao clonar template",
        description: "Não foi possível clonar o template. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {template.nome}
            {template.premium && (
              <Badge className="bg-yellow-500">Premium</Badge>
            )}
          </DialogTitle>
          <DialogDescription>{template.descricao}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="detalhes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="versoes">Histórico de Versões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalhes" className="space-y-4 mt-4">
            <div>
              <h4 className="font-medium mb-2">Informações</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 mr-1">Categoria:</span>
                  <span>{template.categoria}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 mr-1">Autor:</span>
                  <span>{template.autor}</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 mr-1">Avaliação:</span>
                  <span>{template.avaliacao}</span>
                </div>
                <div className="flex items-center">
                  <CodeBracketIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 mr-1">Versão:</span>
                  <span>{template.version || "1.0.0"}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {template.premium && template.preco !== undefined && (
              <div className="flex items-center justify-between">
                <div className="font-medium">Preço</div>
                <div className="font-medium text-lg text-primary-700">
                  R$ {template.preco.toFixed(2)}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="versoes" className="mt-4">
            <h4 className="font-medium mb-2">Histórico de Versões</h4>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : versionHistory.length > 0 ? (
              <div className="space-y-3">
                {versionHistory.map((version, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium flex items-center">
                        <CodeBracketIcon className="h-4 w-4 mr-1" />
                        Versão {version.version}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(version.released_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{version.changelog}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Não há histórico de versões disponível.</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleCloneTemplate}>
            {template.premium && template.preco && template.preco > 0 ? "Comprar Template" : "Usar Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
