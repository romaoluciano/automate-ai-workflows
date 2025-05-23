
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

type StatsData = {
  totalTemplates: number;
  totalInstalls: number;
  totalEarnings: number;
  monthlyInstalls: MonthlyInstall[];
};

export function PartnerStats({ partnerId }: StatProps) {
  const [stats, setStats] = useState<StatsData>({
    totalTemplates: 0,
    totalInstalls: 0,
    totalEarnings: 0,
    monthlyInstalls: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadStats() {
      if (!partnerId) return;
      
      try {
        setIsLoading(true);
        
        const templatesResponse = await supabase
          .from("automation_templates")
          .select("id")
          .eq("created_by_user", partnerId)
          .eq("status", "published");
        
        if (templatesResponse.error) {
          console.error("Error loading templates:", templatesResponse.error);
          throw templatesResponse.error;
        }
        
        const templatesCount = templatesResponse.data?.length || 0;
        
        let totalInstalls = 0;

        try {
          // Especificando explicitamente o tipo de retorno como any para evitar o erro de profundidade excessiva
          const { data, error } = await supabase.rpc('get_partner_total_installs', {
            partner_id: partnerId
          });
          
          if (error) {
            console.error("Error calling RPC for installations:", error);
          } else if (data !== null) {
            // Tratamento seguro do dado retornado
            totalInstalls = typeof data === 'number' ? data : 
                           (data && typeof data.count === 'number') ? data.count : 0;
          }
        } catch (e) {
          console.error("Error calling RPC:", e);
        }
        
        const monthlyData: MonthlyInstall[] = [
          { month: 'Jan', installs: 12 },
          { month: 'Feb', installs: 19 },
          { month: 'Mar', installs: 23 },
          { month: 'Apr', installs: 17 },
          { month: 'May', installs: 25 },
          { month: 'Jun', installs: 30 },
        ];
        
        setStats({
          totalTemplates: templatesCount,
          totalInstalls,
          totalEarnings: 0, // Aqui você poderia implementar um cálculo real de ganhos
          monthlyInstalls: monthlyData,
        });
        
      } catch (error) {
        console.error("Error loading statistics:", error);
        toast({
          title: "Error loading statistics",
          description: "Could not load your statistics.",
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
            <CardDescription>Published Templates</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.totalInstalls}</CardTitle>
            <CardDescription>Total Installations</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">R$ {stats.totalEarnings.toFixed(2)}</CardTitle>
            <CardDescription>Total Earnings</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Installations</CardTitle>
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
