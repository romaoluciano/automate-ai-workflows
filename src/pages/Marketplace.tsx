import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowPathIcon, 
  StarIcon,
  TagIcon,
  BoltIcon,
  UserGroupIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
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
    // Filtro de busca
    const matchesSearch = 
      template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.includes(searchTerm.toLowerCase()));
    
    // Filtro de categoria
    const matchesCategoria = categoriaAtiva === "Todas" || template.categoria === categoriaAtiva;
    
    // Filtro de tab
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
          <Input
            placeholder="Buscar templates..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Tabs value={filtroTab} onValueChange={setFiltroTab}>
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="gratuitos">Gratuitos</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant={categoria === categoriaAtiva ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {template.nome}
                    {template.premium && (
                      <Badge className="ml-2 bg-yellow-500">Premium</Badge>
                    )}
                  </CardTitle>
                  <span className="flex items-center text-yellow-500">
                    <StarIcon className="h-4 w-4 mr-1" />
                    {template.avaliacao}
                  </span>
                </div>
                <CardDescription className="mt-1 line-clamp-2">
                  {template.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-col space-y-2 mt-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <TagIcon className="h-4 w-4 mr-2" />
                    <span>Categoria: {template.categoria}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>Autor: {template.autor}</span>
                  </div>
                  <div className="flex items-center">
                    <BoltIcon className="h-4 w-4 mr-2" />
                    <span>{template.instalacoes} instalações</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 p-4">
                <Button 
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg font-medium">Nenhum template encontrado</p>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros de busca.
              </p>
            </div>
          )}
        </div>
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
        categories={categorias}
      />
    </MainLayout>
  );
}
