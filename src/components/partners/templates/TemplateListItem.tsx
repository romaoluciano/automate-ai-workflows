
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EyeIcon, PencilIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Template } from "./types";

interface TemplateListItemProps {
  template: Template;
  onNewVersion: (template: Template) => void;
}

export function TemplateListItem({ template, onNewVersion }: TemplateListItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Under Review</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "draft":
        return <Badge className="bg-gray-500">Draft</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {template.name}
        {template.is_premium && (
          <Badge className="ml-2 bg-yellow-500">Premium</Badge>
        )}
      </TableCell>
      <TableCell>{template.category}</TableCell>
      <TableCell>{template.version || "1.0.0"}</TableCell>
      <TableCell>{getStatusBadge(template.status)}</TableCell>
      <TableCell>{template.installs}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" title="View Details">
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            title="Edit Template"
            disabled={template.status === "published"}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            title="New Version"
            onClick={() => onNewVersion(template)}
            disabled={template.status !== "published"}
          >
            <ArrowPathIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
