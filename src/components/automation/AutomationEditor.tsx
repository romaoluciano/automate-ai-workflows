
import React from "react";
import { Button } from "@/components/ui/button";
import { FlowEditor } from "@/components/automation/FlowEditor";

interface AutomationEditorProps {
  selectedAutomation: string | null;
  automationTemplate: any;
  onBack: () => void;
}

export function AutomationEditor({ 
  selectedAutomation, 
  automationTemplate, 
  onBack 
}: AutomationEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="mr-4">
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
  );
}
