
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiagnosticoForm } from "@/components/diagnostico/DiagnosticoForm";
import { ListaRecomendacoes } from "@/components/diagnostico/ListaRecomendacoes";
import { useDiagnosis } from "@/hooks/useDiagnosis";

export const processAreas = [
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
  const {
    activeTab,
    setActiveTab,
    loading,
    diagnosticoRealizado,
    recomendacoes,
    form,
    handleInputChange,
    handleSubmitDiagnostico
  } = useDiagnosis();

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
              onImplementar={(recomendacao) => {
                console.log("Implementing recommendation:", recomendacao);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
