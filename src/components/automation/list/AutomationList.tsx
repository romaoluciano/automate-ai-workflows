
import React from "react";
import { AutomationCard } from "./AutomationCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Automation {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  execucoes: number;
  ultimaExecucao: string;
}

interface AutomationListProps {
  automations: Automation[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onEditAutomation: (id: string) => void;
}

export function AutomationList({
  automations,
  activeTab,
  onTabChange,
  onEditAutomation,
}: AutomationListProps) {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Buscar automações..."
          className="max-w-sm"
        />
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="minhas">Minhas Automações</TabsTrigger>
            <TabsTrigger value="equipe">Da Equipe</TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            {...automation}
            onEdit={onEditAutomation}
          />
        ))}
      </div>
    </>
  );
}
