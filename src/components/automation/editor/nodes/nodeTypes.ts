
export const AVAILABLE_NODES = {
  Gatilhos: [
    { type: "trigger", label: "Nova Lead" },
    { type: "trigger", label: "Tempo/Agendamento" },
    { type: "trigger", label: "Webhook" },
  ],
  Ações: [
    { type: "action", label: "Enviar Email" },
    { type: "action", label: "Atualizar CRM" },
    { type: "action", label: "Notificação" },
  ],
  Saídas: [
    { type: "output", label: "Salvar no Banco" },
    { type: "output", label: "Notificar Equipe" },
  ],
};

export type NodeData = {
  label: string;
  type: "trigger" | "action" | "output";
  config?: Record<string, any>;
};

export function validateFlow(nodes: any[], edges: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if there's exactly one trigger node
  const triggerNodes = nodes.filter((node) => node.type === "trigger");
  if (triggerNodes.length === 0) {
    errors.push("O fluxo precisa ter um gatilho");
  } else if (triggerNodes.length > 1) {
    errors.push("O fluxo só pode ter um gatilho");
  }

  // Check if there's at least one output node
  const outputNodes = nodes.filter((node) => node.type === "output");
  if (outputNodes.length === 0) {
    errors.push("O fluxo precisa ter pelo menos uma saída");
  }

  // Check if all nodes are connected
  const connectedNodes = new Set();
  edges.forEach((edge) => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  nodes.forEach((node) => {
    if (!connectedNodes.has(node.id) && node.type !== "trigger") {
      errors.push(`O nó "${node.data.label}" não está conectado`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
