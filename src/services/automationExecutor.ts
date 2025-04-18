
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NodeData } from "@/components/automation/editor/nodes/nodeTypes";
import { Json } from "@/integrations/supabase/types";

// Type definitions
export interface ExecutionResult {
  id: string;
  status: "success" | "failed" | "running";
  startTime: string;
  endTime?: string;
  duration?: number;
  logs: ExecutionLog[];
  output?: any;
}

export interface ExecutionLog {
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
  nodeId?: string;
  details?: any;
}

export interface ExecutionOptions {
  automationId: string;
  userId?: string;
  inputData?: Record<string, any>;
}

// Helper function to convert a normal object to a Json compatible type
function toJsonCompatible<T>(obj: T): Json {
  return JSON.parse(JSON.stringify(obj));
}

// Main executor class
export class AutomationExecutor {
  private automationId: string;
  private nodes: any[];
  private edges: any[];
  private logs: ExecutionLog[] = [];
  private executionId: string;
  private startTime: Date;
  private userId?: string;
  private inputData?: Record<string, any>;

  constructor(options: ExecutionOptions) {
    this.automationId = options.automationId;
    this.userId = options.userId;
    this.inputData = options.inputData;
    this.executionId = crypto.randomUUID();
    this.startTime = new Date();
    this.nodes = [];
    this.edges = [];
  }

  // Load the automation flow from the database
  private async loadAutomation(): Promise<boolean> {
    try {
      const { data: automation, error } = await supabase
        .from("automations")
        .select("*")
        .eq("id", this.automationId)
        .single();

      if (error) {
        this.log("error", `Failed to load automation: ${error.message}`);
        return false;
      }

      if (!automation || !automation.json_schema) {
        this.log("error", "Automation not found or schema is empty");
        return false;
      }

      // Check if json_schema is an object and has nodes and edges properties
      const schema = automation.json_schema as any;
      if (typeof schema === 'object' && schema !== null && 'nodes' in schema && 'edges' in schema) {
        // Extract nodes and edges from the JSON schema
        this.nodes = schema.nodes || [];
        this.edges = schema.edges || [];
      } else {
        this.log("error", "Invalid automation schema format");
        return false;
      }

      this.log("info", `Loaded automation: ${automation.name}`);
      return true;
    } catch (error) {
      this.log("error", `Error loading automation: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  // Create a record of the execution in the database
  private async createExecutionRecord(status: "running" | "success" | "failed"): Promise<string | null> {
    try {
      const executionData = {
        automation_id: this.automationId,
        status,
        started_at: this.startTime.toISOString(),
        finished_at: status !== "running" ? new Date().toISOString() : null,
        duration_ms: status !== "running" ? new Date().getTime() - this.startTime.getTime() : null,
        result: toJsonCompatible({
          logs: this.logs,
          output: status === "success" ? this.prepareOutput() : null
        })
      };

      const { data, error } = await supabase
        .from("executions")
        .insert(executionData)
        .select("id")
        .single();

      if (error) {
        console.error("Failed to create execution record:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Error creating execution record:", error);
      return null;
    }
  }

  // Update an existing execution record
  private async updateExecutionRecord(status: "success" | "failed"): Promise<boolean> {
    if (!this.executionId) return false;

    try {
      const endTime = new Date();
      const duration = endTime.getTime() - this.startTime.getTime();

      const { error } = await supabase
        .from("executions")
        .update({
          status,
          finished_at: endTime.toISOString(),
          duration_ms: duration,
          result: toJsonCompatible({
            logs: this.logs,
            output: status === "success" ? this.prepareOutput() : null
          })
        })
        .eq("id", this.executionId);

      if (error) {
        console.error("Failed to update execution record:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating execution record:", error);
      return false;
    }
  }

  private prepareOutput(): any {
    // Process the final output nodes
    const outputNodes = this.nodes.filter(node => node.type === "output");
    
    if (outputNodes.length === 0) {
      return { result: "No output nodes found" };
    }
    
    // For MVP, we'll just return a simple object with the output node labels
    return outputNodes.reduce((acc, node) => {
      acc[node.id] = {
        label: node.data.label,
        executed: true
      };
      return acc;
    }, {});
  }

  // Create an alert for the execution
  private async createAlert(type: string, message: string): Promise<void> {
    try {
      await supabase
        .from("alerts")
        .insert({
          type,
          message,
          execution_id: this.executionId,
          sent_at: new Date().toISOString(),
          is_read: false
        });
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  }

  // Add a log entry
  private log(level: "info" | "warning" | "error", message: string, details?: any, nodeId?: string): void {
    const logEntry: ExecutionLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details,
      nodeId
    };
    
    this.logs.push(logEntry);
    console.log(`[${level}] ${message}`, details || "");
  }

  // Process a single node
  private async processNode(node: any, data: any): Promise<any> {
    try {
      this.log("info", `Processing node: ${node.data.label}`, null, node.id);
      
      switch (node.type) {
        case "trigger":
          // For MVP, just log that trigger was processed
          this.log("info", `Trigger activated: ${node.data.label}`, null, node.id);
          return { success: true, output: data || this.inputData || {} };
          
        case "action":
          // For MVP, we'll simulate integration with n8n or Make
          return await this.executeIntegrationAction(node, data);
          
        case "output":
          // For MVP, just log the output
          this.log("info", `Output reached: ${node.data.label}`, data, node.id);
          return { success: true, output: data };
          
        default:
          this.log("warning", `Unknown node type: ${node.type}`, null, node.id);
          return { success: false, error: "Unknown node type" };
      }
    } catch (error) {
      this.log("error", `Error processing node ${node.id}: ${error instanceof Error ? error.message : String(error)}`, null, node.id);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // Simulate integration with n8n or Make
  private async executeIntegrationAction(node: any, data: any): Promise<any> {
    // This is a simplified MVP implementation that simulates integration
    // In a real implementation, this would call an API or webhook
    
    this.log("info", `Executing action: ${node.data.label}`, { input: data }, node.id);
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, randomly succeed or fail
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      this.log("info", `Action completed successfully: ${node.data.label}`, null, node.id);
      return { 
        success: true, 
        output: { 
          ...data,
          processed: true,
          timestamp: new Date().toISOString() 
        } 
      };
    } else {
      const errorMessage = `Action failed: ${node.data.label}`;
      this.log("error", errorMessage, null, node.id);
      return { success: false, error: errorMessage };
    }
  }

  // Find next nodes to execute based on edges
  private findNextNodes(nodeId: string): any[] {
    const nextEdges = this.edges.filter(edge => edge.source === nodeId);
    return nextEdges.map(edge => {
      const targetNode = this.nodes.find(n => n.id === edge.target);
      return targetNode;
    }).filter(Boolean);
  }

  // Execute the flow
  public async execute(): Promise<ExecutionResult> {
    // Start the execution record
    const executionRecordId = await this.createExecutionRecord("running");
    if (executionRecordId) {
      this.executionId = executionRecordId;
    }
    
    this.log("info", "Starting automation execution");
    
    try {
      // Load the automation
      const loaded = await this.loadAutomation();
      if (!loaded) {
        await this.updateExecutionRecord("failed");
        await this.createAlert("error", "Failed to load automation");
        return this.getExecutionResult("failed");
      }
      
      // Find the trigger node (should be only one)
      const triggerNode = this.nodes.find(node => node.type === "trigger");
      if (!triggerNode) {
        this.log("error", "No trigger node found in the automation");
        await this.updateExecutionRecord("failed");
        await this.createAlert("error", "No trigger node found in the automation");
        return this.getExecutionResult("failed");
      }
      
      // Process the trigger node
      const triggerResult = await this.processNode(triggerNode, this.inputData);
      if (!triggerResult.success) {
        this.log("error", "Trigger node failed", triggerResult.error);
        await this.updateExecutionRecord("failed");
        await this.createAlert("error", "Automation trigger failed");
        return this.getExecutionResult("failed");
      }
      
      // Start processing from the trigger node
      const result = await this.processFlow(triggerNode.id, triggerResult.output);
      
      // Update the execution record with the result
      await this.updateExecutionRecord(result.success ? "success" : "failed");
      
      // Create an alert if the execution failed
      if (!result.success) {
        await this.createAlert("error", `Automation execution failed: ${result.error}`);
      }
      
      this.log("info", `Automation execution ${result.success ? "completed successfully" : "failed"}`);
      
      return this.getExecutionResult(result.success ? "success" : "failed");
    } catch (error) {
      this.log("error", `Unhandled error during execution: ${error instanceof Error ? error.message : String(error)}`);
      await this.updateExecutionRecord("failed");
      await this.createAlert("error", "Automation execution failed with an unhandled error");
      return this.getExecutionResult("failed");
    }
  }

  // Process the flow starting from a node
  private async processFlow(startNodeId: string, data: any): Promise<{ success: boolean, error?: string }> {
    // Find next nodes to process
    const nextNodes = this.findNextNodes(startNodeId);
    
    if (nextNodes.length === 0) {
      // End of flow
      return { success: true };
    }
    
    // Process each next node
    for (const nextNode of nextNodes) {
      const nodeResult = await this.processNode(nextNode, data);
      
      if (!nodeResult.success) {
        return { success: false, error: nodeResult.error };
      }
      
      // Continue processing the flow
      const flowResult = await this.processFlow(nextNode.id, nodeResult.output);
      if (!flowResult.success) {
        return flowResult;
      }
    }
    
    return { success: true };
  }

  // Get the final execution result
  private getExecutionResult(status: "success" | "failed" | "running"): ExecutionResult {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();
    
    return {
      id: this.executionId,
      status,
      startTime: this.startTime.toISOString(),
      endTime: status !== "running" ? endTime.toISOString() : undefined,
      duration: status !== "running" ? duration : undefined,
      logs: this.logs,
      output: status === "success" ? this.prepareOutput() : undefined
    };
  }
}

// Helper function to execute an automation
export async function executeAutomation(options: ExecutionOptions): Promise<ExecutionResult> {
  const executor = new AutomationExecutor(options);
  return await executor.execute();
}
