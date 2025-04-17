
import React, { useState, useCallback, MouseEvent } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TriggerNode } from "./nodes/TriggerNode";
import { ActionNode } from "./nodes/ActionNode";
import { OutputNode } from "./nodes/OutputNode";

// Definições de tipos personalizados para os nós
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode,
};

// Dados iniciais para demonstração
const initialNodes: Node[] = [
  {
    id: "1",
    type: "trigger",
    position: { x: 250, y: 100 },
    data: { label: "Nova Lead Recebida" },
  },
  {
    id: "2",
    type: "action",
    position: { x: 250, y: 250 },
    data: { label: "Enviar Email" },
  },
  {
    id: "3",
    type: "output",
    position: { x: 250, y: 400 },
    data: { label: "Registrar no CRM" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

// Componentes para o painel de nós disponíveis
const NodeItem = ({ type, label, onDragStart }: { type: string; label: string; onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string) => void }) => (
  <div
    className="cursor-grab border rounded p-2 mb-2 bg-white hover:bg-gray-50"
    onDragStart={(event) => onDragStart(event, type)}
    draggable
  >
    {label}
  </div>
);

export function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("Nova Automação");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    // Necessário para o drag-and-drop funcionar
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      
      // Verificar se o tipo é válido e temos uma posição
      if (!type) return;

      // Obter a posição do ponto de queda no canvas
      const reactFlowBounds = document
        .querySelector(".react-flow")
        ?.getBoundingClientRect();
      
      if (!reactFlowBounds) return;

      const reactFlowInstance = document.querySelector(".react-flow-wrapper");
      if (!reactFlowInstance) return;

      // Calcular posição de queda
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Criar um novo nó
      const newNode: Node = {
        id: `node_${nodes.length + 1}`,
        type,
        position,
        data: { label: `Novo ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Button className="bg-primary-500 hover:bg-primary-600">Salvar Automação</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-70px)]">
        <Tabs defaultValue="editor" className="h-full">
          <div className="border-b px-4">
            <TabsList className="ml-0">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="test">Testar</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="editor" className="h-[calc(100%-40px)] m-0">
            <div className="flex h-full">
              <div className="w-64 border-r p-4 bg-gray-50">
                <h3 className="font-medium mb-3">Blocos Disponíveis</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Gatilhos</h4>
                  <NodeItem type="trigger" label="Nova Lead" onDragStart={onDragStart} />
                  <NodeItem type="trigger" label="Tempo/Agendamento" onDragStart={onDragStart} />
                  <NodeItem type="trigger" label="Webhook" onDragStart={onDragStart} />
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Ações</h4>
                  <NodeItem type="action" label="Enviar Email" onDragStart={onDragStart} />
                  <NodeItem type="action" label="Atualizar CRM" onDragStart={onDragStart} />
                  <NodeItem type="action" label="Notificação" onDragStart={onDragStart} />
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Saídas</h4>
                  <NodeItem type="output" label="Salvar no Banco" onDragStart={onDragStart} />
                  <NodeItem type="output" label="Notificar Equipe" onDragStart={onDragStart} />
                </div>
              </div>
              
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
                  <MiniMap />
                  <Panel position="top-right">
                    <Button variant="outline" size="sm" className="mr-2">Reorganizar</Button>
                    <Button variant="outline" size="sm">Limpar</Button>
                  </Panel>
                </ReactFlow>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="h-[calc(100%-40px)] m-0 p-4">
            <h3 className="text-lg font-medium mb-4">Configurações da Automação</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da Automação</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea className="w-full border rounded p-2 mt-1" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Tags</label>
                <input type="text" className="w-full border rounded p-2 mt-1" placeholder="Ex: contabilidade, vendas" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="h-[calc(100%-40px)] m-0 p-4">
            <h3 className="text-lg font-medium mb-4">Testar Automação</h3>
            <Button className="bg-primary-500 hover:bg-primary-600 mb-4">Executar Teste</Button>
            <div className="border rounded p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Resultados</h4>
              <div className="text-sm text-gray-600">Execute um teste para ver os resultados</div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
