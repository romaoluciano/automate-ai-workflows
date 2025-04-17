
import { useState, useCallback } from "react";
import { Edge, Node, Connection, useNodesState, useEdgesState, addEdge } from "@xyflow/react";
import { validateFlow } from "./nodes/nodeTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAutomationFlow(automationId?: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const saveFlow = async (name: string) => {
    setIsLoading(true);
    
    const validation = validateFlow(nodes, edges);
    if (!validation.isValid) {
      toast({
        title: "Erro de Validação",
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const flowData = {
        name,
        json_schema: {
          nodes,
          edges,
        },
      };

      if (automationId) {
        await supabase
          .from("automations")
          .update(flowData)
          .eq("id", automationId);
        
        toast({
          title: "Sucesso",
          description: "Automação atualizada com sucesso",
        });
      } else {
        await supabase
          .from("automations")
          .insert([flowData]);
        
        toast({
          title: "Sucesso",
          description: "Automação criada com sucesso",
        });
      }
    } catch (error) {
      console.error("Error saving flow:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a automação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFlow = async (id: string) => {
    setIsLoading(true);
    try {
      const { data: automation } = await supabase
        .from("automations")
        .select("*")
        .eq("id", id)
        .single();

      if (automation?.json_schema) {
        setNodes(automation.json_schema.nodes);
        setEdges(automation.json_schema.edges);
      }
    } catch (error) {
      console.error("Error loading flow:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar a automação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveFlow,
    loadFlow,
    isLoading,
  };
}
