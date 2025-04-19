
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Map recommendation complexity to node types
const complexityToNodeMap = {
  "Baixa": ["trigger", "action", "output"],
  "Média": ["trigger", "action", "action", "output"],
  "Alta": ["trigger", "action", "action", "action", "output"],
};

export function useAutomationTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const createAutomationTemplateFromRecommendation = (recommendation: any) => {
    const complexity = recommendation.complexity || "Média";
    const nodeTypes = complexityToNodeMap[complexity as keyof typeof complexityToNodeMap] || 
                     complexityToNodeMap["Média"];
    
    // Generate a basic automation flow based on the recommendation
    const nodes = [];
    const edges = [];
    
    // Create nodes based on complexity
    let xPosition = 100;
    let lastNodeId = "";
    
    for (let i = 0; i < nodeTypes.length; i++) {
      const nodeType = nodeTypes[i];
      const nodeId = `${nodeType}_${Date.now()}_${i}`;
      
      let nodeLabel = "";
      if (nodeType === "trigger") {
        nodeLabel = `Iniciar ${recommendation.title}`;
      } else if (nodeType === "output") {
        nodeLabel = "Finalizar Processo";
      } else {
        nodeLabel = `Etapa ${i} do Processo`;
      }
      
      nodes.push({
        id: nodeId,
        type: nodeType,
        position: { x: xPosition, y: 200 },
        data: { label: nodeLabel }
      });
      
      // Create edge from previous node to this one
      if (lastNodeId) {
        edges.push({
          id: `edge_${lastNodeId}_${nodeId}`,
          source: lastNodeId,
          target: nodeId,
          type: "smoothstep"
        });
      }
      
      lastNodeId = nodeId;
      xPosition += 200; // Space nodes horizontally
    }
    
    return {
      name: recommendation.title,
      description: recommendation.description,
      nodes,
      edges
    };
  };

  useEffect(() => {
    if (location.state?.createFromRecommendation) {
      const recommendation = location.state.recommendationData;
      
      // Clear the location state to prevent recreation on refresh
      navigate(location.pathname, { replace: true });
      
      toast({
        title: "Automação Iniciada",
        description: `Criando automação baseada na recomendação: ${recommendation.title}`,
      });

      return createAutomationTemplateFromRecommendation(recommendation);
    }
  }, [location, navigate, toast]);

  return { createAutomationTemplateFromRecommendation };
}
