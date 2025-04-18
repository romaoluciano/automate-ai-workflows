
import React from "react";
import { Button } from "@/components/ui/button";
import { CircleCheckIcon, ClockIcon, CircleDashedIcon, InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = React.useState(false);

  const handleVerDetalhes = () => {
    setShowDetails(!showDetails);
  };

  const handleCriarAutomacao = () => {
    // Perform the implementation action
    onImplementar(recomendacao);
    
    // Navigate to the automation editor
    navigate('/automacoes', { 
      state: { 
        createFromRecommendation: true,
        recommendationData: recomendacao
      } 
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{recomendacao.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {recomendacao.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleVerDetalhes}
          >
            {showDetails ? "Ocultar Detalhes" : "Ver Detalhes"}
          </Button>
          <Button 
            size="sm" 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={handleCriarAutomacao}
          >
            Implementar
          </Button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Detalhes da Implementação:</h4>
          <p className="text-sm mb-2">
            Esta recomendação permite automatizar o processo descrito, economizando aproximadamente {recomendacao.timeSavings} 
            de trabalho manual por mês.
          </p>
          <div className="text-sm">
            <p className="font-medium">Passos para implementação:</p>
            <ol className="list-decimal pl-5 mt-1 space-y-1">
              <li>Configurar o gatilho de inicialização do processo</li>
              <li>Conectar com os sistemas relevantes</li>
              <li>Definir regras de processamento de dados</li>
              <li>Configurar as notificações e resultados</li>
            </ol>
          </div>
        </div>
      )}

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
