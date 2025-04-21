
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PartnerApplicationForm } from "@/components/partners/PartnerApplicationForm";

export default function PartnerApplication() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Torne-se um Parceiro</h1>
          <p className="text-muted-foreground">
            Crie e publique seus templates de automação no marketplace e ganhe comissões.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Por que se tornar um parceiro?</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">📈 Alcance</h3>
                <p>Disponibilize seus templates para milhares de usuários em nossa plataforma.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">💰 Comissões</h3>
                <p>Receba comissões por cada venda de template premium que você criar.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">🔄 Versões</h3>
                <p>Gerencie facilmente as versões dos seus templates e receba feedback.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg">⭐ Visibilidade</h3>
                <p>Destaque-se como especialista em automação e expanda seu portfólio.</p>
              </div>
            </div>
          </div>
          
          <div>
            <PartnerApplicationForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
