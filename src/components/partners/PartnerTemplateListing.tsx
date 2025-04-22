
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlusIcon, PencilIcon, ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";
import { TemplateVersionModal } from "./TemplateVersionModal";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  status: string;
  version: string;
  created_at: string;
  installs: number;
}

interface PartnerTemplateListingProps {
  partnerId: string | undefined;
}

export function PartnerTemplateListing({ partnerId }: PartnerTemplateListingProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    async function loadTemplates() {
      if (!partnerId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch templates created by the partner
        const { data, error } = await supabase
          .from("automation_templates")
          .select(`
            id, 
            name, 
            description, 
            category, 
            is_premium, 
            created_at
          `)
          .eq("created_by_user", partnerId);
          
        if (error) {
          console.error("Error loading templates:", error);
          toast({
            title: "Error loading templates",
            description: error.message,
            variant: "destructive",
          });
          setTemplates([]);
          return;
        }
        
        if (data) {
          // Fetch the latest version for each template
          const templatesWithVersions = await Promise.all(data.map(async (template) => {
            const { data: versionData, error: versionError } = await supabase
              .from("automation_templates_versions")
              .select("version, status")
              .eq("template_id", template.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();
            
            return {
              ...template,
              version: versionData?.version || "1.0.0",
              status: versionData?.status || "draft",
              installs: Math.floor(Math.random() * 100) // Simulated value
            };
          }));
          
          setTemplates(templatesWithVersions);
        } else {
          setTemplates([]);
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        toast({
          title: "Error loading templates",
          description: "Could not load your templates.",
          variant: "destructive",
        });
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTemplates();
  }, [partnerId, toast]);

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
    return (
      <div className="bg-white rounded-lg p-6 border text-center">
        <h3 className="text-lg font-medium mb-4">No Templates Found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't submitted any templates to the marketplace yet.
        </p>
        <Button onClick={() => {}}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create First Template
        </Button>
      </div>
    );
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
            <TableRow key={template.id}>
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
                    onClick={() => handleNewVersion(template)}
                    disabled={template.status !== "published"}
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
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

