
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { ROIMetrics } from "@/components/dashboard/ROIMetrics";
import { AutomationsOverview } from "@/components/dashboard/AutomationsOverview";
import { ExecutionsTable } from "@/components/dashboard/ExecutionsTable";
import { AlertsList } from "@/components/automation/execution/AlertsList";
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  BoltIcon,
  DocumentCheckIcon 
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu ambiente de automações.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Horas Poupadas"
            value="1.420"
            description="Este mês"
            icon={<ClockIcon className="h-6 w-6" />}
            change={{ value: 12, type: "increase" }}
          />
          <StatCard
            title="Custo Poupado"
            value="R$ 56.800"
            description="Este mês"
            icon={<CurrencyDollarIcon className="h-6 w-6" />}
            change={{ value: 18, type: "increase" }}
          />
          <StatCard
            title="Automações Ativas"
            value="18"
            description="de 31 totais"
            icon={<BoltIcon className="h-6 w-6" />}
          />
          <StatCard
            title="Execuções"
            value="3.725"
            description="Este mês"
            icon={<DocumentCheckIcon className="h-6 w-6" />}
            change={{ value: 5, type: "increase" }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ROIMetrics />
          <AutomationsOverview />
          <AlertsList />
        </div>

        <ExecutionsTable />
      </div>
    </MainLayout>
  );
}
