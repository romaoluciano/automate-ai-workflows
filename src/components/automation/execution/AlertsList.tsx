
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: string;
  message: string;
  sent_at: string;
  is_read: boolean;
  execution_id: string | null;
}

interface AlertsListProps {
  limit?: number;
  showTitle?: boolean;
}

export function AlertsList({ limit = 5, showTitle = true }: AlertsListProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_read: true })
        .eq("id", alertId);

      if (error) {
        throw error;
      }

      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (error) {
      console.error("Error marking alert as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge className="bg-red-500">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>;
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      default:
        return <Badge className="bg-gray-500">{type}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        {showTitle && <CardTitle className="text-lg">Recent Alerts</CardTitle>}
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAlerts}
          disabled={isLoading}
        >
          <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border rounded-md ${
                  !alert.is_read ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-gray-500" />
                    {getAlertBadge(alert.type)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTimestamp(alert.sent_at)}
                  </div>
                </div>
                <p className="my-2 text-sm">{alert.message}</p>
                <div className="flex justify-between items-center">
                  {alert.execution_id && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-xs"
                      onClick={() => {
                        // Here you could navigate to execution details
                        console.log("View execution:", alert.execution_id);
                      }}
                    >
                      View Execution
                    </Button>
                  )}
                  {!alert.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No alerts to display.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
