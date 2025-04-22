
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";

interface TemplateListHeaderProps {
  onCreateNew: () => void;
}

export function TemplateListHeader({ onCreateNew }: TemplateListHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-6 border text-center">
      <h3 className="text-lg font-medium mb-4">No Templates Found</h3>
      <p className="text-muted-foreground mb-4">
        You haven't submitted any templates to the marketplace yet.
      </p>
      <Button onClick={onCreateNew}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Create First Template
      </Button>
    </div>
  );
}
