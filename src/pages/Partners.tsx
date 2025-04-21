
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PartnerDashboard } from "@/components/partners/PartnerDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Partners() {
  const { user, isPartner, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Redirecionar para o portal de parceiros se não for parceiro
  if (!user || !isPartner) {
    return <Navigate to="/partner-application" />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portal de Parceiros</h1>
          <p className="text-muted-foreground">
            Gerencie seus templates e acompanhe suas métricas de vendas.
          </p>
        </div>
        
        <PartnerDashboard />
      </div>
    </MainLayout>
  );
}
