
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dados simulados de execuções
const executions = [
  {
    id: "exec_1",
    automationName: "Processamento de notas fiscais",
    startTime: "2023-06-12 14:32:15",
    duration: 28,
    status: "success",
  },
  {
    id: "exec_2",
    automationName: "Integração de leads",
    startTime: "2023-06-12 13:15:22",
    duration: 45,
    status: "success",
  },
  {
    id: "exec_3",
    automationName: "Envio de relatórios",
    startTime: "2023-06-12 12:05:43",
    duration: 15,
    status: "success",
  },
  {
    id: "exec_4",
    automationName: "Atualização do CRM",
    startTime: "2023-06-12 11:47:31",
    duration: 120,
    status: "failed",
  },
  {
    id: "exec_5",
    automationName: "Geração de propostas",
    startTime: "2023-06-12 10:30:10",
    duration: 60,
    status: "success",
  },
];

export function ExecutionsTable() {
  // Função para formatar o status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Sucesso</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Erro</Badge>;
      case "running":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      default:
        return <Badge className="bg-gray-500">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Últimas Execuções</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Automação</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell className="font-medium">{execution.automationName}</TableCell>
                <TableCell>{execution.startTime}</TableCell>
                <TableCell>{execution.duration}s</TableCell>
                <TableCell>{getStatusBadge(execution.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
