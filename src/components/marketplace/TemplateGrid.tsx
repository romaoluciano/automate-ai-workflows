
import React from "react";
import { TemplateCard } from "./TemplateCard";

interface TemplateGridProps {
  templates: Array<{
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    avaliacao: number;
    instalacoes: number;
    autor: string;
    premium: boolean;
    tags: string[];
  }>;
  onTemplateSelect: (template: any) => void;
}

export function TemplateGrid({ templates, onTemplateSelect }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="col-span-3 text-center py-12">
        <p className="text-lg font-medium">Nenhum template encontrado</p>
        <p className="text-muted-foreground">
          Tente ajustar seus filtros de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onViewDetails={() => onTemplateSelect(template)}
        />
      ))}
    </div>
  );
}
