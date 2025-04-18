
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiagnosisForm {
  area: string;
  areaCustom: string;
  descricaoProcesso: string;
  frequencia: string;
  tempoMedio: string;
  ferramentas: string;
  desafios: string;
}

export interface Recommendation {
  title: string;
  description: string;
  benefits: string[];
  complexity: string;
  implementationTime: string;
  timeSavings: string;
}

export interface AIRecommendations {
  recommendations: Recommendation[];
}

export function useDiagnosis() {
  const [activeTab, setActiveTab] = useState("formulario");
  const [loading, setLoading] = useState(false);
  const [diagnosticoRealizado, setDiagnosticoRealizado] = useState(false);
  const [diagnosisId, setDiagnosisId] = useState<string | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<Recommendation[]>([]);
  const { toast } = useToast();

  const [form, setForm] = useState<DiagnosisForm>({
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

  useEffect(() => {
    const fetchSavedDiagnosis = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('diagnoses')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
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

  return {
    activeTab,
    setActiveTab,
    loading,
    diagnosticoRealizado,
    recomendacoes,
    form,
    handleInputChange,
    handleSubmitDiagnostico
  };
}
