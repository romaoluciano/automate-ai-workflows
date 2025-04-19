
import React from "react";
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

interface TemplateDetailModalProps {
  template: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    tags: string[];
    autor: string;
    premium: boolean;
    json_schema?: any;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateDetailModal({ template, isOpen, onClose }: TemplateDetailModalProps) {
  const { toast } = useToast();

  const handleCloneTemplate = async () => {
    if (!template) return;

    try {
      const { data: automation, error } = await supabase
        .from("automations")
        .insert({
          name: `${template.nome} (Clone)`,
          description: template.descricao,
          json_schema: template.json_schema || {},
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;

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

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Detalhes</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Categoria:</span>
                <span className="ml-2">{template.categoria}</span>
              </div>
              <div>
                <span className="text-gray-500">Autor:</span>
                <span className="ml-2">{template.autor}</span>
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

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={handleCloneTemplate}>
              Usar Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
