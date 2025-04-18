
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlayIcon } from "lucide-react";
import { useAutomationExecution } from "@/hooks/useAutomationExecution";
import { ExecutionDetails } from "./ExecutionDetails";

interface RunButtonProps {
  automationId?: string;
  nodes: any[];
  edges: any[];
  isValid: boolean;
}

export function RunButton({ automationId, nodes, edges, isValid }: RunButtonProps) {
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  const { isExecuting, currentExecution, runAutomation } = useAutomationExecution();

  const handleRunAutomation = async () => {
    if (!automationId || !isValid) return;
    
    setShowExecutionDialog(true);
    await runAutomation({ automationId });
  };

  return (
    <>
      <Button
        onClick={handleRunAutomation}
        disabled={isExecuting || !isValid || !automationId}
        className="bg-green-600 hover:bg-green-700"
      >
        <PlayIcon className="h-4 w-4 mr-2" />
        {isExecuting ? "Running..." : "Run Automation"}
      </Button>

      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isExecuting ? "Executing Automation..." : "Execution Results"}
            </DialogTitle>
          </DialogHeader>
          
          {isExecuting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-center text-lg">Executing automation, please wait...</p>
            </div>
          ) : (
            currentExecution && <ExecutionDetails execution={currentExecution} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
