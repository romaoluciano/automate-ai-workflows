import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FlowEditor } from "@/components/automation/FlowEditor";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AutomationList } from "@/components/automation/list/AutomationList";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Automações simuladas
const automacoes = [
  {
    id: "auto1",
    nome: "Processamento de Notas Fiscais",
    descricao: "Automatiza o processamento e lançamento de notas fiscais no sistema contábil",
    status: "active",
    execucoes: 247,
    ultimaExecucao: "12/06/2023 14:32",
  },
  {
    id: "auto2",
    nome: "Integração de Leads do CRM",
    descricao: "Sincroniza leads do site com o CRM e envia mensagem de boas-vindas",
    status: "active",
    execucoes: 189,
    ultimaExecucao: "12/06/2023 13:15",
  },
  {
    id: "auto3",
    nome: "Envio de Relatórios Diários",
    descricao: "Gera e envia relatórios de vendas diários para a diretoria",
    status: "paused",
    execucoes: 102,
    ultimaExecucao: "10/06/2023 18:45",
  },
  {
    id: "auto4",
    nome: "Notificação de Atrasos",
    descricao: "Notifica a equipe sobre tarefas com prazo vencido",
    status: "error",
    execucoes: 78,
    ultimaExecucao: "11/06/2023 09:20",
  },
];

// Map recommendation complexity to node types
const complexityToNodeMap = {
  "Baixa": ["trigger", "action", "output"],
  "Média": ["trigger", "action", "action", "output"],
  "Alta": ["trigger", "action", "action", "action", "output"],
};

export default function Automacoes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("minhas");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [automationTemplate, setAutomationTemplate] = useState<any>(null);
  
  useEffect(() => {
    // Check if we're coming from a recommendation
    if (location.state?.createFromRecommendation) {
      const recommendation = location.state.recommendationData;
      
      // Create a template based on the recommendation
      const template = createAutomationTemplateFromRecommendation(recommendation);
      
      setAutomationTemplate(template);
      setShowEditor(true);
      
      // Clear the location state to prevent recreation on refresh
      navigate(location.pathname, { replace: true });
      
      toast({
        title: "Automação Iniciada",
        description: `Criando automação baseada na recomendação: ${recommendation.title}`,
      });
    }
  }, [location, navigate, toast]);
  
  const createAutomationTemplateFromRecommendation = (recommendation: any) => {
    // Convert the recommendation complexity to a template structure
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
  
  const handleNovaAutomacao = () => {
    setSelectedAutomation(null);
    setAutomationTemplate(null);
    setShowEditor(true);
  };

  const handleEditarAutomacao = (id: string) => {
    setSelectedAutomation(id);
    setAutomationTemplate(null);
    setShowEditor(true);
  };

  const handleVoltarLista = () => {
    setShowEditor(false);
    setSelectedAutomation(null);
    setAutomationTemplate(null);
  };

  return (
    <MainLayout>
      {!showEditor ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
              <p className="text-muted-foreground">
                Gerencie e crie suas automações de processos.
              </p>
            </div>
            <Button 
              onClick={handleNovaAutomacao}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Nova Automação
            </Button>
          </div>

          <AutomationList
            automations={automacoes}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onEditAutomation={handleEditarAutomacao}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={handleVoltarLista} className="mr-4">
              Voltar para lista
            </Button>
            <h1 className="text-xl font-bold tracking-tight">
              {selectedAutomation ? "Editar Automação" : automationTemplate ? 
                `Nova Automação: ${automationTemplate.name}` : "Nova Automação"}
            </h1>
          </div>
          <div className="h-[calc(100vh-180px)]">
            <FlowEditor 
              automationId={selectedAutomation} 
              initialTemplate={automationTemplate}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
