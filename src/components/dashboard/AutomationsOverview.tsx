
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const data = [
  { name: "Ativas", value: 18, totalHoras: 980, custoPoupado: 39200 },
  { name: "Pausadas", value: 5, totalHoras: 320, custoPoupado: 12800 },
  { name: "Rascunhos", value: 8, totalHoras: 0, custoPoupado: 0 },
];

const chartConfig = {
  Ativas: {
    label: "Ativas",
    color: "#8b5cf6",
  },
  Pausadas: {
    label: "Pausadas",
    color: "#f59e0b",
  },
  Rascunhos: {
    label: "Rascunhos",
    color: "#d1d5db",
  },
};

export function AutomationsOverview() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Automações</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie 
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`var(--color-${entry.name})`} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, entry) => {
                if (name === "value") {
                  const item = entry.payload;
                  return [
                    `${value} automações\n${item.totalHoras} horas poupadas\nR$ ${item.custoPoupado} economizados`,
                    item.name
                  ];
                }
                return [value, name];
              }}
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
