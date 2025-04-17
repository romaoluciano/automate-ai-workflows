
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  change,
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {change && (
            <div className="mt-1 flex items-center">
              <div
                className={cn(
                  "text-xs font-medium",
                  change.type === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {change.type === "increase" ? "+" : "-"}
                {change.value}%
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                desde o último mês
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-primary-500">{icon}</div>}
      </div>
    </div>
  );
}
