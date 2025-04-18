
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const monthlyData = [
  { name: "Jan", horasPoupadas: 120, custoPoupado: 4800 },
  { name: "Fev", horasPoupadas: 150, custoPoupado: 6000 },
  { name: "Mar", horasPoupadas: 200, custoPoupado: 8000 },
  { name: "Abr", horasPoupadas: 250, custoPoupado: 10000 },
  { name: "Mai", horasPoupadas: 320, custoPoupado: 12800 },
  { name: "Jun", horasPoupadas: 380, custoPoupado: 15200 },
];

const weeklyData = [
  { name: "Seg", horasPoupadas: 28, custoPoupado: 1120 },
  { name: "Ter", horasPoupadas: 32, custoPoupado: 1280 },
  { name: "Qua", horasPoupadas: 35, custoPoupado: 1400 },
  { name: "Qui", horasPoupadas: 30, custoPoupado: 1200 },
  { name: "Sex", horasPoupadas: 40, custoPoupado: 1600 },
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
                <Tooltip content={<CustomTooltip />} />
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
                  name="Custo Poupado (R$)" 
                  fill="var(--color-custoPoupado)"
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
                <Tooltip content={<CustomTooltip />} />
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
                  name="Custo Poupado (R$)" 
                  fill="var(--color-custoPoupado)"
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Custom tooltip component
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <div 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">
                {item.name === "horasPoupadas" ? "Horas Poupadas" : "Custo Poupado"}:
              </span>
            </div>
            <span className="text-sm font-medium">
              {item.name === "custoPoupado" ? `R$ ${item.value}` : `${item.value} horas`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
