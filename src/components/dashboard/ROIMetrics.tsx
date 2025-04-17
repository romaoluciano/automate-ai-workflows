
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Jan", horasPoupadas: 120, custoPoupado: 4800 },
  { name: "Fev", horasPoupadas: 150, custoPoupado: 6000 },
  { name: "Mar", horasPoupadas: 200, custoPoupado: 8000 },
  { name: "Abr", horasPoupadas: 250, custoPoupado: 10000 },
  { name: "Mai", horasPoupadas: 320, custoPoupado: 12800 },
  { name: "Jun", horasPoupadas: 380, custoPoupado: 15200 },
];

export function ROIMetrics() {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Retorno sobre Investimento (ROI)</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "horasPoupadas") return [`${value} horas`, "Horas Poupadas"];
                if (name === "custoPoupado") return [`R$ ${value}`, "Custo Poupado"];
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="horasPoupadas" 
              name="Horas Poupadas" 
              fill="#8b5cf6" 
            />
            <Bar 
              yAxisId="right" 
              dataKey="custoPoupado" 
              name="Custo Poupado (R$)" 
              fill="#6d28d9" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
