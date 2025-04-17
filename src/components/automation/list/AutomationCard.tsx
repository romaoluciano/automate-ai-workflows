
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClockIcon, CheckCircleIcon, PauseIcon, XCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface AutomationCardProps {
  id: string;
  nome: string;
  descricao: string;
  status: string;
  execucoes: number;
  ultimaExecucao: string;
  onEdit: (id: string) => void;
}

export function AutomationCard({
  id,
  nome,
  descricao,
  status,
  execucoes,
  ultimaExecucao,
  onEdit,
}: AutomationCardProps) {
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

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{nome}</CardTitle>
          {getStatusBadge(status)}
        </div>
        <CardDescription className="mt-1">
          {descricao}
        </CardDescription>
      </CardHeader>
      <CardContent className="border-t bg-gray-50 p-4">
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <ClockIcon className="mr-1 h-4 w-4" />
            <span>{ultimaExecucao}</span>
          </div>
          <div>{execucoes} execuções</div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" size="sm">Ver Histórico</Button>
          <Button
            size="sm"
            className="bg-primary-500 hover:bg-primary-600"
            onClick={() => onEdit(id)}
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
