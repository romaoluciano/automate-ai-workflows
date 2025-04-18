
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon, ClockIcon, CircleDashedIcon } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  complexity: string;
  implementationTime: string;
  timeSavings: string;
}

interface RecomendacaoCardProps {
  recomendacao: Recommendation;
  onImplementar: (recomendacao: Recommendation) => void;
}

export const RecomendacaoCard: React.FC<RecomendacaoCardProps> = ({
  recomendacao,
  onImplementar,
}) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{recomendacao.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {recomendacao.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
          <Button 
            size="sm" 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={() => onImplementar(recomendacao)}
          >
            Implementar
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Benefícios:</h4>
        <ul className="space-y-1">
          {recomendacao.benefits.map((beneficio, i) => (
            <li key={i} className="text-sm flex items-center">
              <CircleCheckIcon className="h-4 w-4 text-green-500 mr-2" />
              {beneficio}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex mt-4 space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <CircleDashedIcon className="h-4 w-4 mr-1" />
          Complexidade: {recomendacao.complexity}
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          Tempo: {recomendacao.implementationTime}
        </div>
      </div>
    </div>
  );
};
