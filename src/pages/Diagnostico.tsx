
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CircleCheckIcon, ClockIcon, CircleDashedIcon } from "lucide-react";

const processAreas = [
  { value: "vendas", label: "Vendas e CRM" },
  { value: "marketing", label: "Marketing" },
  { value: "rh", label: "Recursos Humanos" },
  { value: "financeiro", label: "Financeiro" },
  { value: "atendimento", label: "Atendimento ao Cliente" },
  { value: "operacoes", label: "Operações" },
  { value: "logistica", label: "Logística" },
  { value: "compras", label: "Compras" },
  { value: "outro", label: "Outro (especifique)" },
];

export default function Diagnostico() {
  const [activeTab, setActiveTab] = useState("formulario");
  const [loading, setLoading] = useState(false);
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState(false);
  
  // Formulário de diagnóstico
  const [form, setForm] = useState({
    area: "",
    areaCustom: "",
    descricaoProcesso: "",
    frequencia: "",
    tempoMedio: "",
    ferramentas: "",
    desafios: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmitDiagnostico = () => {
    setLoading(true);
    
    // Simulando o processamento da IA
    setTimeout(() => {
      setLoading(false);
      setDiagnosticoRealizado(true);
      setActiveTab("recomendacoes");
    }, 3000);
  };

  // Recomendações simuladas da IA
  const recomendacoes = [
    {
      titulo: "Automação de Envio de Propostas",
      descricao: "Automatize a geração e envio de propostas comerciais quando novos leads forem qualificados no CRM.",
      beneficios: ["Redução de 70% no tempo de processamento", "Eliminação de erros manuais", "Aumento na taxa de conversão"],
      complexidade: "Média",
      tempoImplementacao: "3-5 dias",
    },
    {
      titulo: "Integração CRM e Email Marketing",
      descricao: "Sincronize automaticamente novos leads do CRM para a plataforma de email marketing, segmentando por fonte e interesse.",
      beneficios: ["Comunicação personalizada", "Economia de 5 horas semanais", "Segmentação precisa"],
      complexidade: "Baixa",
      tempoImplementacao: "1-2 dias",
    },
    {
      titulo: "Alertas Inteligentes de Follow-up",
      descricao: "Crie alertas automáticos para a equipe de vendas quando leads não receberem follow-up no prazo adequado.",
      beneficios: ["Redução na perda de oportunidades", "Melhor experiência do cliente", "Visibilidade do pipeline"],
      complexidade: "Baixa",
      tempoImplementacao: "1 dia",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnóstico de Automação</h1>
          <p className="text-muted-foreground">
            Nossa IA analisará seus processos e sugerirá automações personalizadas.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="formulario" disabled={loading}>
              Formulário
            </TabsTrigger>
            <TabsTrigger value="recomendacoes" disabled={!diagnosticoRealizado || loading}>
              Recomendações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formulario" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnóstico de Processos</CardTitle>
                <CardDescription>
                  Descreva o processo que deseja otimizar para receberemcomendações de automação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Área do Processo</label>
                  <Select
                    value={form.area}
                    onValueChange={(value) => handleInputChange("area", value)}
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
                      onChange={(e) => handleInputChange("areaCustom", e.target.value)}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição do Processo</label>
                  <Textarea
                    placeholder="Descreva detalhadamente o processo atual..."
                    rows={4}
                    value={form.descricaoProcesso}
                    onChange={(e) => handleInputChange("descricaoProcesso", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Frequência</label>
                    <Select
                      value={form.frequencia}
                      onValueChange={(value) => handleInputChange("frequencia", value)}
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
                      onValueChange={(value) => handleInputChange("tempoMedio", value)}
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
                    onChange={(e) => handleInputChange("ferramentas", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Desafios Atuais</label>
                  <Textarea
                    placeholder="Quais são os maiores problemas ou gargalos neste processo?"
                    rows={3}
                    value={form.desafios}
                    onChange={(e) => handleInputChange("desafios", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSubmitDiagnostico}
                  disabled={!form.area || !form.descricaoProcesso || loading}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  {loading ? "Analisando..." : "Analisar com IA"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="recomendacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Automação</CardTitle>
                <CardDescription>
                  Com base na sua descrição, identificamos oportunidades de automação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recomendacoes.map((recomendacao, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{recomendacao.titulo}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {recomendacao.descricao}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
                            Implementar
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Benefícios:</h4>
                        <ul className="space-y-1">
                          {recomendacao.beneficios.map((beneficio, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <CircleCheckIcon className="h-4 w-4 text-green-500 mr-2" />
                              {beneficio}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex mt-4 space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <CircleDashedIcon className="h-4 w-4 mr-1" />
                          Complexidade: {recomendacao.complexidade}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Tempo: {recomendacao.tempoImplementacao}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("formulario")}>
                  Voltar ao Diagnóstico
                </Button>
                <Button className="bg-primary-500 hover:bg-primary-600">
                  Implementar Todas
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
