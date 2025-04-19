import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { TemplateGrid } from "@/components/marketplace/TemplateGrid";
import { TemplateDetailModal } from "@/components/marketplace/TemplateDetailModal";
import { TemplateSubmissionForm } from "@/components/marketplace/TemplateSubmissionForm";

// Templates simulados
const templates = [
  {
    id: "temp1",
    nome: "Onboarding de Clientes",
    descricao: "Automatiza todo o processo de boas-vindas e cadastro inicial de novos clientes",
    categoria: "Atendimento",
    avaliacao: 4.9,
    instalacoes: 1245,
    autor: "Equipe AutomateAI",
    premium: false,
    tags: ["onboarding", "clientes", "email"],
  },
  {
    id: "temp2",
    nome: "Gestão de Leads",
    descricao: "Captura, qualifica e distribui leads automaticamente para os vendedores",
    categoria: "Vendas",
    avaliacao: 4.7,
    instalacoes: 987,
    autor: "Equipe AutomateAI",
    premium: false,
    tags: ["leads", "vendas", "crm"],
  },
  {
    id: "temp3",
    nome: "Conciliação Bancária",
    descricao: "Automatize a conciliação de extratos bancários com o sistema financeiro",
    categoria: "Financeiro",
    avaliacao: 4.8,
    instalacoes: 856,
    autor: "FinTech Solutions",
    premium: true,
    tags: ["financeiro", "banco", "conciliação"],
  },
  {
    id: "temp4",
    nome: "Gestão de Férias e Ausências",
    descricao: "Automatiza solicitações, aprovações e comunicações de férias da equipe",
    categoria: "RH",
    avaliacao: 4.5,
    instalacoes: 642,
    autor: "HR Cloud",
    premium: true,
    tags: ["rh", "férias", "colaboradores"],
  },
  {
    id: "temp5",
    nome: "Follow-up Inteligente",
    descricao: "Sistema automatizado de follow-up com clientes e leads baseado em comportamento",
    categoria: "Vendas",
    avaliacao: 4.9,
    instalacoes: 1389,
    autor: "SalesBoost",
    premium: true,
    tags: ["vendas", "follow-up", "crm"],
  },
  {
    id: "temp6",
    nome: "Agendamento Inteligente",
    descricao: "Automatiza a gestão de agendas, confirmações e lembretes para reuniões",
    categoria: "Produtividade",
    avaliacao: 4.6,
    instalacoes: 738,
    autor: "Equipe AutomateAI",
    premium: false,
    tags: ["agenda", "reuniões", "produtividade"],
  },
];

// Categorias
const categorias = [
  "Todas",
  "Vendas",
  "Financeiro",
  "RH",
  "Atendimento",
  "Marketing",
  "Produtividade",
  "Logística",
];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [filtroTab, setFiltroTab] = useState("todos");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Filtrar templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    
    const matchesCategoria = categoriaAtiva === "Todas" || template.categoria === categoriaAtiva;
    
    const matchesTab = 
      filtroTab === "todos" || 
      (filtroTab === "gratuitos" && !template.premium) ||
      (filtroTab === "premium" && template.premium);
    
    return matchesSearch && matchesCategoria && matchesTab;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Descubra e implemente templates de automação pré-construídos.
            </p>
          </div>
          <Button onClick={() => setIsSubmissionFormOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Submeter Template
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          
          <Tabs value={filtroTab} onValueChange={setFiltroTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="gratuitos">Gratuitos</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <CategoryFilter
          categories={categorias}
          activeCategory={categoriaAtiva}
          onCategoryChange={setCategoriaAtiva}
        />

        <TemplateGrid
          templates={filteredTemplates}
          onTemplateSelect={(template) => {
            setSelectedTemplate(template);
            setIsDetailModalOpen(true);
          }}
        />
      </div>

      <TemplateDetailModal
        template={selectedTemplate}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTemplate(null);
        }}
      />

      <TemplateSubmissionForm
        isOpen={isSubmissionFormOpen}
        onClose={() => setIsSubmissionFormOpen(false)}
        categories={categorias.filter(cat => cat !== "Todas")}
      />
    </MainLayout>
  );
}
