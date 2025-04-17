
import { Card, CardContent } from "@/components/ui/card";
import { NodeItem } from "./NodeItem";
import { AVAILABLE_NODES } from "./nodes/nodeTypes";

export function NodePalette() {
  return (
    <Card className="w-64 border-r">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Blocos Disponíveis</h3>
        
        {Object.entries(AVAILABLE_NODES).map(([category, nodes]) => (
          <div key={category} className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {category}
            </h4>
            {nodes.map((node) => (
              <NodeItem
                key={node.type}
                type={node.type}
                label={node.label}
                category={category}
              />
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
