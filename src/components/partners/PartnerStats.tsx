
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface StatProps {
  partnerId: string | undefined;
}

type MonthlyInstall = {
  month: string;
  installs: number;
};

export function PartnerStats({ partnerId }: StatProps) {
  const [stats, setStats] = useState({
    totalTemplates: 0,
    totalInstalls: 0,
    totalEarnings: 0,
    monthlyInstalls: [] as MonthlyInstall[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadStats() {
      if (!partnerId) return;
      
      try {
        setIsLoading(true);
        
        // Carrega total de templates
        const { data: templatesData, error: templatesError } = await supabase
          .from("automation_templates")
          .select("id")
          .eq("created_by_user", partnerId)
          .eq("status", "published");
          
        if (templatesError) {
          console.error("Erro ao carregar templates:", templatesError);
          throw templatesError;
        }
        
        // Carrega total de instalações
        let totalInstalls = 0;
        try {
          // Using type assertion to avoid TypeScript error
          const { data: installsData, error: installsError } = await supabase
            .rpc("get_partner_total_installs", { partner_id: partnerId } as any);
            
          if (installsError) {
            console.error("Erro ao chamar RPC para instalações:", installsError);
          } else if (installsData) {
            // Check if installsData is an array and has at least one item
            if (Array.isArray(installsData) && installsData.length > 0) {
              // Type assertion for the first item to access count property safely
              const firstItem = installsData[0] as any;
              totalInstalls = firstItem && typeof firstItem.count !== 'undefined' ? Number(firstItem.count) : 0;
            }
          }
        } catch (e) {
          console.error("Erro ao chamar RPC:", e);
          // Continua com totalInstalls = 0
        }
        
        // Carrega ganhos totais (esse seria um RPC customizado no backend)
        // Simulando dados para o exemplo
        const totalEarnings = 0; // Para implementar com sistema de pagamentos real
        
        // Carrega dados de instalações mensais (simulados)
        const monthlyData: MonthlyInstall[] = [
          { month: 'Jan', installs: 12 },
          { month: 'Fev', installs: 19 },
          { month: 'Mar', installs: 23 },
          { month: 'Abr', installs: 17 },
          { month: 'Mai', installs: 25 },
          { month: 'Jun', installs: 30 },
        ];
        
        setStats({
          totalTemplates: templatesData?.length || 0,
          totalInstalls: totalInstalls,
          totalEarnings: totalEarnings,
          monthlyInstalls: monthlyData,
        });
        
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível carregar suas estatísticas.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadStats();
  }, [partnerId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalTemplates}</CardTitle>
            <CardDescription>Templates Publicados</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalInstalls}</CardTitle>
            <CardDescription>Total de Instalações</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">R$ {stats.totalEarnings.toFixed(2)}</CardTitle>
            <CardDescription>Ganhos Totais</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Instalações Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.monthlyInstalls}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="installs" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
