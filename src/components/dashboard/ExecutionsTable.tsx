
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { 
  EyeIcon, 
  RefreshCw, 
  CalendarIcon, 
  FilterIcon 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExecutionDetails } from "@/components/automation/execution/ExecutionDetails";

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
  const [selectedExecution, setSelectedExecution] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState("today");

  // Simular uma atualização da tabela
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Format timestamp based on period
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (period === "today") {
      return date.toLocaleTimeString();
    }
    return date.toLocaleString();
  };

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
    <>
      <Card className="col-span-2">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Últimas Execuções</CardTitle>
          <div className="flex items-center gap-2">
            <Select 
              value={period} 
              onValueChange={setPeriod}
            >
              <SelectTrigger className="w-[150px]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Automação</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell className="font-medium">{execution.automationName}</TableCell>
                  <TableCell>{formatTimestamp(execution.startTime)}</TableCell>
                  <TableCell>{execution.duration}s</TableCell>
                  <TableCell>{getStatusBadge(execution.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedExecution({
                        ...execution,
                        logs: [],
                        output: { result: "Detalhes da execução" },
                        startTime: execution.startTime,
                        endTime: new Date().toISOString(),
                        duration: execution.duration * 1000
                      })}
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedExecution} onOpenChange={(open) => !open && setSelectedExecution(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Execução</DialogTitle>
          </DialogHeader>
          {selectedExecution && <ExecutionDetails execution={selectedExecution} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
