
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarIcon, TagIcon, UserGroupIcon, BoltIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface TemplateCardProps {
  template: {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
    avaliacao: number;
    instalacoes: number;
    autor: string;
    premium: boolean;
    tags: string[];
  };
  onViewDetails: () => void;
}

export function TemplateCard({ template, onViewDetails }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {template.nome}
            {template.premium && (
              <Badge className="ml-2 bg-yellow-500">Premium</Badge>
            )}
          </CardTitle>
          <span className="flex items-center text-yellow-500">
            <StarIcon className="h-4 w-4 mr-1" />
            {template.avaliacao}
          </span>
        </div>
        <CardDescription className="mt-1 line-clamp-2">
          {template.descricao}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <TagIcon className="h-4 w-4 mr-2" />
            <span>Categoria: {template.categoria}</span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 mr-2" />
            <span>Autor: {template.autor}</span>
          </div>
          <div className="flex items-center">
            <BoltIcon className="h-4 w-4 mr-2" />
            <span>{template.instalacoes} instalações</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 p-4">
        <Button className="w-full" onClick={onViewDetails}>
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
