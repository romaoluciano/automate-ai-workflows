
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RotateCw } from "lucide-react";
import { ExecutionDetails } from "./ExecutionDetails";
import { useAutomationExecution } from "@/hooks/useAutomationExecution";

interface ExecutionHistoryProps {
  automationId: string;
}

export function ExecutionHistory({ automationId }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<any | null>(null);
  const { fetchExecutionHistory } = useAutomationExecution();

  const loadExecutions = async () => {
    setIsLoading(true);
    const data = await fetchExecutionHistory(automationId);
    setExecutions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (automationId) {
      loadExecutions();
    }
  }, [automationId]);

  // Format the duration to a readable format
  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return "N/A";
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }
    
    const seconds = Math.floor(durationMs / 1000);
    
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format the timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "running":
        return <Badge className="bg-blue-500">Running</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const handleViewDetails = (execution: any) => {
    setSelectedExecution({
      ...execution,
      logs: execution.result?.logs || [],
      output: execution.result?.output || null,
      startTime: execution.started_at,
      endTime: execution.finished_at,
      duration: execution.duration_ms
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Execution History</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadExecutions} 
            disabled={isLoading}
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {executions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Started At</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>{formatTimestamp(execution.started_at)}</TableCell>
                    <TableCell>{formatDuration(execution.duration_ms)}</TableCell>
                    <TableCell>{getStatusBadge(execution.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(execution)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No executions found for this automation.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedExecution} onOpenChange={(open) => !open && setSelectedExecution(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
          </DialogHeader>
          {selectedExecution && <ExecutionDetails execution={selectedExecution} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
