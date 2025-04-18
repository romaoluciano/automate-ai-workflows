
import React, { useCallback, useEffect, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodePalette } from "./editor/NodePalette";
import { TriggerNode } from "./nodes/TriggerNode";
import { ActionNode } from "./nodes/ActionNode";
import { OutputNode } from "./nodes/OutputNode";
import { useAutomationFlow } from "./editor/useAutomationFlow";
import { RunButton } from "./execution/RunButton";
import { ExecutionHistory } from "./execution/ExecutionHistory";
import { validateFlow } from "./editor/nodes/nodeTypes";

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode,
};

interface FlowEditorProps {
  automationId?: string;
  name?: string;
  onSave?: () => void;
  initialTemplate?: {
    name: string;
    description: string;
    nodes: any[];
    edges: any[];
  };
}

export function FlowEditor({ 
  automationId, 
  name = "Nova Automação", 
  onSave,
  initialTemplate 
}: FlowEditorProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveFlow,
    loadFlow,
    setNodes,
    setEdges,
    isLoading
  } = useAutomationFlow(automationId);

  const [activeTab, setActiveTab] = useState("editor");
  const [flowValid, setFlowValid] = useState(false);

  // Validate flow whenever nodes or edges change
  useEffect(() => {
    const validation = validateFlow(nodes, edges);
    setFlowValid(validation.isValid);
  }, [nodes, edges]);

  // Load automation if ID is provided
  useEffect(() => {
    if (automationId) {
      loadFlow(automationId);
    }
  }, [automationId, loadFlow]);

  // Load initial template if provided
  useEffect(() => {
    if (initialTemplate && initialTemplate.nodes && initialTemplate.edges) {
      setNodes(initialTemplate.nodes);
      setEdges(initialTemplate.edges);
    }
  }, [initialTemplate, setNodes, setEdges]);

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
    await saveFlow(initialTemplate?.name || name);
    onSave?.();
  };

  const handleReorganize = () => {
    // Simple automatic layout algorithm
    const triggerNodes = nodes.filter(node => node.type === "trigger");
    const actionNodes = nodes.filter(node => node.type === "action");
    const outputNodes = nodes.filter(node => node.type === "output");
    
    const startX = 50;
    const startY = 100;
    const horizontalSpacing = 250;
    const verticalSpacing = 150;
    
    const updatedNodes = [...nodes];
    
    // Position trigger nodes at the start
    triggerNodes.forEach((node, index) => {
      const updatedNode = {
        ...node,
        position: {
          x: startX,
          y: startY + index * verticalSpacing
        }
      };
      const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = updatedNode;
      }
    });
    
    // Position action nodes in the middle
    actionNodes.forEach((node, index) => {
      const updatedNode = {
        ...node,
        position: {
          x: startX + horizontalSpacing,
          y: startY + index * (verticalSpacing / 2)
        }
      };
      const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = updatedNode;
      }
    });
    
    // Position output nodes at the end
    outputNodes.forEach((node, index) => {
      const updatedNode = {
        ...node,
        position: {
          x: startX + horizontalSpacing * 2,
          y: startY + index * verticalSpacing
        }
      };
      const nodeIndex = updatedNodes.findIndex(n => n.id === node.id);
      if (nodeIndex !== -1) {
        updatedNodes[nodeIndex] = updatedNode;
      }
    });
    
    setNodes(updatedNodes);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the flow? This action cannot be undone.")) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{initialTemplate?.name || name}</CardTitle>
          <div className="flex gap-2">
            <RunButton 
              automationId={automationId} 
              nodes={nodes} 
              edges={edges} 
              isValid={flowValid} 
            />
            <Button 
              className="bg-primary-500 hover:bg-primary-600"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Automação"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-70px)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            {automationId && (
              <TabsTrigger value="executions" className="flex-1">
                Executions
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="editor" className="h-full">
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
                    <Button variant="outline" size="sm" className="mr-2" onClick={handleReorganize}>
                      Reorganizar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      Limpar
                    </Button>
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
          
          {automationId && (
            <TabsContent value="executions" className="p-4 h-full overflow-auto">
              <ExecutionHistory automationId={automationId} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
