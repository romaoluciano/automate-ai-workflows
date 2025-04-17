
import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NodePalette } from "./editor/NodePalette";
import { TriggerNode } from "./nodes/TriggerNode";
import { ActionNode } from "./nodes/ActionNode";
import { OutputNode } from "./nodes/OutputNode";
import { useAutomationFlow } from "./editor/useAutomationFlow";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode,
};

interface FlowEditorProps {
  automationId?: string;
  name?: string;
  onSave?: () => void;
}

export function FlowEditor({ automationId, name = "Nova Automação", onSave }: FlowEditorProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveFlow,
    isLoading
  } = useAutomationFlow(automationId);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeData = event.dataTransfer.getData("application/reactflow");
      if (!nodeData) return;

      const { type, label } = JSON.parse(nodeData);
      
      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { label },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [onNodesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleSave = async () => {
    await saveFlow(name);
    onSave?.();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Button 
            className="bg-primary-500 hover:bg-primary-600"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Automação"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-70px)]">
        <div className="flex h-full">
          <NodePalette />
          <div className="flex-1 h-full" onDrop={onDrop} onDragOver={onDragOver}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Background />
              <Controls />
              <Panel position="top-right">
                <Button variant="outline" size="sm" className="mr-2">
                  Reorganizar
                </Button>
                <Button variant="outline" size="sm">
                  Limpar
                </Button>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
