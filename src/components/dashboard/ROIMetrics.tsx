
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const monthlyData = [
  { name: "Jan", horasPoupadas: 120, custoPoupado: 4800, roi: 380 },
  { name: "Fev", horasPoupadas: 150, custoPoupado: 6000, roi: 400 },
  { name: "Mar", horasPoupadas: 200, custoPoupado: 8000, roi: 420 },
  { name: "Abr", horasPoupadas: 250, custoPoupado: 10000, roi: 450 },
  { name: "Mai", horasPoupadas: 320, custoPoupado: 12800, roi: 460 },
  { name: "Jun", horasPoupadas: 380, custoPoupado: 15200, roi: 480 },
];

const weeklyData = [
  { name: "Seg", horasPoupadas: 28, custoPoupado: 1120, roi: 380 },
  { name: "Ter", horasPoupadas: 32, custoPoupado: 1280, roi: 385 },
  { name: "Qua", horasPoupadas: 35, custoPoupado: 1400, roi: 390 },
  { name: "Qui", horasPoupadas: 30, custoPoupado: 1200, roi: 375 },
  { name: "Sex", horasPoupadas: 40, custoPoupado: 1600, roi: 395 },
];

const chartConfig = {
  horasPoupadas: {
    label: "Horas Poupadas",
    color: "#8b5cf6",
  },
  custoPoupado: {
    label: "Custo Poupado (R$)",
    color: "#6d28d9",
  },
  roi: {
    label: "ROI (%)",
    color: "#22c55e",
  }
};

export function ROIMetrics() {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Retorno sobre Investimento (ROI)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mensal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mensal" className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <YAxis yAxisId="roi" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "roi") return [`${value}%`, "ROI"];
                    if (name === "custoPoupado") return [`R$ ${value}`, "Custo Poupado"];
                    return [`${value}h`, "Horas Poupadas"];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="horasPoupadas" 
                  name="Horas Poupadas" 
                  fill="var(--color-horasPoupadas)" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="custoPoupado" 
                  name="Custo Poupado" 
                  fill="var(--color-custoPoupado)"
                />
                <Bar 
                  yAxisId="roi" 
                  dataKey="roi" 
                  name="ROI" 
                  fill="var(--color-roi)"
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="semanal" className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <YAxis yAxisId="roi" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "roi") return [`${value}%`, "ROI"];
                    if (name === "custoPoupado") return [`R$ ${value}`, "Custo Poupado"];
                    return [`${value}h`, "Horas Poupadas"];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="horasPoupadas" 
                  name="Horas Poupadas" 
                  fill="var(--color-horasPoupadas)" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="custoPoupado" 
                  name="Custo Poupado" 
                  fill="var(--color-custoPoupado)"
                />
                <Bar 
                  yAxisId="roi" 
                  dataKey="roi" 
                  name="ROI" 
                  fill="var(--color-roi)"
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
