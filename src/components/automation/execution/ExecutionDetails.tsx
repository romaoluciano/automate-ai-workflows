
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExecutionResult, ExecutionLog } from "@/services/automationExecutor";

interface ExecutionDetailsProps {
  execution: ExecutionResult;
}

export function ExecutionDetails({ execution }: ExecutionDetailsProps) {
  // Format the duration to a readable format
  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return "N/A";
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }
    
    const seconds = Math.floor(durationMs / 1000);
    const ms = durationMs % 1000;
    
    if (seconds < 60) {
      return `${seconds}.${ms}s`;
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

  // Render a log entry
  const renderLogEntry = (log: ExecutionLog, index: number) => {
    const getBadgeColor = (level: string) => {
      switch (level) {
        case "info":
          return "bg-blue-500";
        case "warning":
          return "bg-yellow-500";
        case "error":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };

    return (
      <div key={index} className="py-2 border-b last:border-b-0">
        <div className="flex items-center justify-between mb-1">
          <Badge className={getBadgeColor(log.level)}>
            {log.level.toUpperCase()}
          </Badge>
          <span className="text-xs text-gray-500">
            {formatTimestamp(log.timestamp)}
          </span>
        </div>
        <p className="text-sm">{log.message}</p>
        {log.nodeId && (
          <div className="text-xs text-gray-500 mt-1">Node: {log.nodeId}</div>
        )}
        {log.details && (
          <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
            {typeof log.details === "object"
              ? JSON.stringify(log.details, null, 2)
              : log.details}
          </pre>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Execution Details</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>ID: {execution.id}</span>
          {getStatusBadge(execution.status)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-500">Start Time</span>
            <p className="font-medium">{formatTimestamp(execution.startTime)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Duration</span>
            <p className="font-medium">{formatDuration(execution.duration)}</p>
          </div>
        </div>

        <Tabs defaultValue="logs">
          <TabsList className="w-full">
            <TabsTrigger value="logs" className="flex-1">Logs</TabsTrigger>
            <TabsTrigger value="output" className="flex-1">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {execution.logs && execution.logs.length > 0 ? (
                  execution.logs.map((log, index) => renderLogEntry(log, index))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-4">
                    No logs available for this execution.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="output">
            <ScrollArea className="h-60">
              {execution.output ? (
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-x-auto">
                  {JSON.stringify(execution.output, null, 2)}
                </pre>
              ) : (
                <p className="text-center text-sm text-gray-500 py-4">
                  No output available for this execution.
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
