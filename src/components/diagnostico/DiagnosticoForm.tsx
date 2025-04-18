
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

interface DiagnosticoFormProps {
  form: {
    area: string;
    areaCustom: string;
    descricaoProcesso: string;
    frequencia: string;
    tempoMedio: string;
    ferramentas: string;
    desafios: string;
  };
  loading: boolean;
  processAreas: Array<{ value: string; label: string }>;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

export const DiagnosticoForm: React.FC<DiagnosticoFormProps> = ({
  form,
  loading,
  processAreas,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico de Processos</CardTitle>
        <CardDescription>
          Descreva o processo que deseja otimizar para receber recomendações de automação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Área do Processo</label>
          <Select
            value={form.area}
            onValueChange={(value) => onInputChange("area", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma área" />
            </SelectTrigger>
            <SelectContent>
              {processAreas.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {form.area === "outro" && (
            <Input
              placeholder="Especifique a área"
              value={form.areaCustom}
              onChange={(e) => onInputChange("areaCustom", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição do Processo</label>
          <Textarea
            placeholder="Descreva detalhadamente o processo atual..."
            rows={4}
            value={form.descricaoProcesso}
            onChange={(e) => onInputChange("descricaoProcesso", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequência</label>
            <Select
              value={form.frequencia}
              onValueChange={(value) => onInputChange("frequencia", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Com que frequência?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Várias vezes ao dia</SelectItem>
                <SelectItem value="diario-unico">Uma vez ao dia</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="sob-demanda">Sob demanda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo Médio</label>
            <Select
              value={form.tempoMedio}
              onValueChange={(value) => onInputChange("tempoMedio", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Quanto tempo leva?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutos">Minutos</SelectItem>
                <SelectItem value="ate-1-hora">Até 1 hora</SelectItem>
                <SelectItem value="1-4-horas">1-4 horas</SelectItem>
                <SelectItem value="meio-dia">Meio dia</SelectItem>
                <SelectItem value="dias">Dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ferramentas Utilizadas</label>
          <Input
            placeholder="Quais softwares ou ferramentas são usados? (Ex: Excel, Gmail, Salesforce)"
            value={form.ferramentas}
            onChange={(e) => onInputChange("ferramentas", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Desafios Atuais</label>
          <Textarea
            placeholder="Quais são os maiores problemas ou gargalos neste processo?"
            rows={3}
            value={form.desafios}
            onChange={(e) => onInputChange("desafios", e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!form.area || !form.descricaoProcesso || loading}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            "Analisar com IA"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
