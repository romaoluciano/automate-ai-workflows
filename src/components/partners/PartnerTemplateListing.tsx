
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TemplateVersionModal } from "./TemplateVersionModal";
import { TemplateListHeader } from "./templates/TemplateListHeader";
import { TemplateListItem } from "./templates/TemplateListItem";
import { useTemplatesList } from "./templates/useTemplatesList";
import { Template } from "./templates/types";

interface PartnerTemplateListingProps {
  partnerId: string | undefined;
}

export function PartnerTemplateListing({ partnerId }: PartnerTemplateListingProps) {
  const { templates, isLoading } = useTemplatesList(partnerId);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const handleNewVersion = (template: Template) => {
    setSelectedTemplate(template);
    setIsVersionModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (templates.length === 0) {
    return <TemplateListHeader onCreateNew={() => {}} />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Installations</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TemplateListItem 
              key={template.id}
              template={template}
              onNewVersion={handleNewVersion}
            />
          ))}
        </TableBody>
      </Table>
      
      <TemplateVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}
