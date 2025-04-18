
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { RecomendacaoCard } from "./RecomendacaoCard";

interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  complexity: string;
  implementationTime: string;
  timeSavings: string;
}

interface ListaRecomendacoesProps {
  recomendacoes: Recommendation[];
  onBackClick: () => void;
  onImplementar: (recomendacao: Recommendation) => void;
}

export const ListaRecomendacoes: React.FC<ListaRecomendacoesProps> = ({
  recomendacoes,
  onBackClick,
  onImplementar,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recomendações de Automação</CardTitle>
        <CardDescription>
          Com base na sua descrição, identificamos oportunidades de automação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recomendacoes.length > 0 ? (
            recomendacoes.map((recomendacao, index) => (
              <RecomendacaoCard
                key={index}
                recomendacao={recomendacao}
                onImplementar={onImplementar}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <div className="flex justify-center">
                <Loader2Icon className="h-10 w-10 text-primary-500 animate-spin" />
              </div>
              <p className="mt-4 text-lg font-medium">Carregando recomendações...</p>
              <p className="text-sm text-gray-500">Aguarde enquanto processamos os resultados</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBackClick}>
          Voltar ao Diagnóstico
        </Button>
        {recomendacoes.length > 0 && (
          <Button className="bg-primary-500 hover:bg-primary-600">
            <SaveIcon className="mr-2 h-4 w-4" />
            Salvar Recomendações
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
