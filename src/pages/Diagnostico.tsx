import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticoForm } from "@/components/diagnostico/DiagnosticoForm";
import { ListaRecomendacoes } from "@/components/diagnostico/ListaRecomendacoes";

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

interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  complexity: string;
  implementationTime: string;
  timeSavings: string;
}

interface AIRecommendations {
  recommendations: Recommendation[];
}

export default function Diagnostico() {
  const [activeTab, setActiveTab] = useState("formulario");
  const [loading, setLoading] = useState(false);
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<Recommendation[]>([]);
  const { toast } = useToast();
  
  const [form, setForm] = useState({
    area: "",
    areaCustom: "",
    descricaoProcesso: "",
    frequencia: "",
    tempoMedio: "",
    ferramentas: "",
    desafios: "",
  });

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
            
            if (diagnosis.ai_recommendations && typeof diagnosis.ai_recommendations === 'object') {
              const aiRecs = diagnosis.ai_recommendations as unknown;
              
              if (aiRecs && 
                  typeof aiRecs === 'object' && 
                  'recommendations' in aiRecs && 
                  Array.isArray((aiRecs as AIRecommendations).recommendations)) {
                setRecomendacoes((aiRecs as AIRecommendations).recommendations);
                setDiagnosticoRealizado(true);
              }
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
      
      const { data, error } = await supabase.functions.invoke("analyze-process", {
        body: {
          diagnosisData: form,
          userId: user.id
        }
      });
      
      if (error) throw error;
      
      setDiagnosisId(data.diagnosisId);
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecomendacoes(data.recommendations);
        setDiagnosticoRealizado(true);
        setActiveTab("recomendacoes");
      }
      
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

  const handleImplementarAutomacao = (recomendacao: Recommendation) => {
    toast({
      title: "Iniciando Implementação",
      description: `Preparando automação: ${recomendacao.title}`,
    });
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
            <DiagnosticoForm
              form={form}
              loading={loading}
              processAreas={processAreas}
              onInputChange={handleInputChange}
              onSubmit={handleSubmitDiagnostico}
            />
          </TabsContent>

          <TabsContent value="recomendacoes" className="mt-6">
            <ListaRecomendacoes
              recomendacoes={recomendacoes}
              onBackClick={() => setActiveTab("formulario")}
              onImplementar={handleImplementarAutomacao}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
