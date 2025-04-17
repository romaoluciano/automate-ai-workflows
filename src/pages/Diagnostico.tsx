
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CircleCheckIcon, ClockIcon, CircleDashedIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);
  const { toast } = useToast();
  
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

  // Verifica se existem recomendações salvas para o usuário atual
  useEffect(() => {
    const fetchSavedDiagnosis = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from("diagnoses")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(1);
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            const diagnosis = data[0];
            setDiagnosisId(diagnosis.id);
            
            if (diagnosis.ai_recommendations?.recommendations) {
              setRecomendacoes(diagnosis.ai_recommendations.recommendations);
              setDiagnosticoRealizado(true);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar diagnósticos salvos:", error);
      }
    };
    
    fetchSavedDiagnosis();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmitDiagnostico = async () => {
    setLoading(true);
    
    try {
      // Verifica se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para realizar um diagnóstico.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      toast({
        title: "Processando",
        description: "Seu diagnóstico está sendo analisado pela IA. Isso pode levar alguns instantes...",
      });
      
      // Envia os dados para a função edge de análise
      const { data, error } = await supabase.functions.invoke("analyze-process", {
        body: {
          diagnosisData: form,
          userId: user.id
        }
      });
      
      if (error) throw error;
      
      // Atualiza o estado com as recomendações
      setDiagnosisId(data.diagnosisId);
      setRecomendacoes(data.recommendations.recommendations || []);
      setDiagnosticoRealizado(true);
      setActiveTab("recomendacoes");
      
      toast({
        title: "Diagnóstico Concluído",
        description: "A análise do seu processo foi concluída com sucesso!",
      });
      
    } catch (error) {
      console.error("Erro ao processar diagnóstico:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar seu diagnóstico. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImplementarAutomacao = (recomendacao: any) => {
    // Esta função será implementada quando integrarmos com o editor de automações
    toast({
      title: "Iniciando Implementação",
      description: `Preparando automação: ${recomendacao.title}`,
    });
    
    // No futuro, redirecionar para o editor de automações com template pré-configurado
  };

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
                  Descreva o processo que deseja otimizar para receber recomendações de automação.
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
                  {recomendacoes.length > 0 ? (
                    recomendacoes.map((recomendacao, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{recomendacao.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {recomendacao.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-primary-500 hover:bg-primary-600"
                              onClick={() => handleImplementarAutomacao(recomendacao)}
                            >
                              Implementar
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Benefícios:</h4>
                          <ul className="space-y-1">
                            {recomendacao.benefits.map((beneficio: string, i: number) => (
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
                            Complexidade: {recomendacao.complexity}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            Tempo: {recomendacao.implementationTime}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="flex justify-center">
                        <Loader2Icon className="h-10 w-10 text-primary-500 animate-spin" />
                      </div>
                      <p className="mt-4 text-lg font-medium">Carregando recomendações...</p>
                      <p className="text-sm text-gray-500">Aguarde enquanto processamos os resultados</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("formulario")}>
                  Voltar ao Diagnóstico
                </Button>
                {recomendacoes.length > 0 && (
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Salvar Recomendações
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
