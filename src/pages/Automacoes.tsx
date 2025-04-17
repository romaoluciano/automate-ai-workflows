
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FlowEditor } from "@/components/automation/FlowEditor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, CheckCircleIcon, Cog6ToothIcon, ClockIcon, PauseIcon, XCircleIcon } from "@heroicons/react/24/outline";

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

export default function Automacoes() {
  const [activeTab, setActiveTab] = useState("minhas");
  const [showEditor, setShowEditor] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  
  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Ativa
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <PauseIcon className="mr-1 h-3 w-3" />
            Pausada
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Erro
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <Cog6ToothIcon className="mr-1 h-3 w-3" />
            Indefinido
          </span>
        );
    }
  };

  const handleNovaAutomacao = () => {
    setSelectedAutomation(null);
    setShowEditor(true);
  };

  const handleEditarAutomacao = (id: string) => {
    setSelectedAutomation(id);
    setShowEditor(true);
  };

  const handleVoltarLista = () => {
    setShowEditor(false);
    setSelectedAutomation(null);
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

          <div className="flex items-center space-x-4">
            <Input
              placeholder="Buscar automações..."
              className="max-w-sm"
            />
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="minhas">Minhas Automações</TabsTrigger>
                <TabsTrigger value="equipe">Da Equipe</TabsTrigger>
                <TabsTrigger value="todas">Todas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {automacoes.map((automacao) => (
              <Card key={automacao.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{automacao.nome}</CardTitle>
                    {getStatusBadge(automacao.status)}
                  </div>
                  <CardDescription className="mt-1">
                    {automacao.descricao}
                  </CardDescription>
                </CardHeader>
                <CardContent className="border-t bg-gray-50 p-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="mr-1 h-4 w-4" />
                      <span>{automacao.ultimaExecucao}</span>
                    </div>
                    <div>{automacao.execucoes} execuções</div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">Ver Histórico</Button>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => handleEditarAutomacao(automacao.id)}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="outline" onClick={handleVoltarLista} className="mr-4">
              Voltar para lista
            </Button>
            <h1 className="text-xl font-bold tracking-tight">
              {selectedAutomation ? "Editar Automação" : "Nova Automação"}
            </h1>
          </div>
          <div className="h-[calc(100vh-180px)]">
            <FlowEditor />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
