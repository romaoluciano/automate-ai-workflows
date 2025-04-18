
import { useState } from "react";
import { 
  executeAutomation, 
  ExecutionResult, 
  ExecutionOptions 
} from "@/services/automationExecutor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAutomationExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecution, setCurrentExecution] = useState<ExecutionResult | null>(null);
  const [executionHistory, setExecutionHistory] = useState<ExecutionResult[]>([]);
  const { toast } = useToast();

  // Run an automation
  const runAutomation = async (options: ExecutionOptions) => {
    if (isExecuting) {
      toast({
        title: "Execution in Progress",
        description: "Please wait for the current execution to complete.",
        variant: "default",
      });
      return null;
    }

    setIsExecuting(true);
    
    try {
      toast({
        title: "Executing Automation",
        description: "The automation is now running...",
      });
      
      const result = await executeAutomation(options);
      
      setCurrentExecution(result);
      setExecutionHistory(prev => [result, ...prev]);
      
      if (result.status === "success") {
        toast({
          title: "Execution Successful",
          description: "The automation completed successfully.",
          variant: "default",
        });
      } else {
        toast({
          title: "Execution Failed",
          description: "The automation failed to complete. Check the logs for details.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      toast({
        title: "Execution Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  // Fetch execution history for an automation
  const fetchExecutionHistory = async (automationId: string) => {
    try {
      const { data, error } = await supabase
        .from("executions")
        .select("*")
        .eq("automation_id", automationId)
        .order("started_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: `Failed to fetch execution history: ${error.message}`,
          variant: "destructive",
        });
        return [];
      }

      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
      return [];
    }
  };

  // Get alerts for an execution
  const fetchExecutionAlerts = async (executionId: string) => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("execution_id", executionId)
        .order("sent_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch alerts:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  };

  return {
    isExecuting,
    currentExecution,
    executionHistory,
    runAutomation,
    fetchExecutionHistory,
    fetchExecutionAlerts,
  };
}
