import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AutomationList } from "@/components/automation/list/AutomationList";
import { AutomationEditor } from "@/components/automation/AutomationEditor";
import { useAutomationTemplate } from "@/hooks/useAutomationTemplate";

// Simulated automations data
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

export default function Automacoes() {
  const [activeTab, setActiveTab] = useState("minhas");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [automationTemplate, setAutomationTemplate] = useState<any>(null);
  
  const { createAutomationTemplateFromRecommendation } = useAutomationTemplate();

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
        <AutomationEditor
          selectedAutomation={selectedAutomation}
          automationTemplate={automationTemplate}
          onBack={handleVoltarLista}
        />
      )}
    </MainLayout>
  );
}
