
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Template } from "./types";

export function useTemplatesList(partnerId: string | undefined) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadTemplates() {
      if (!partnerId) return;
      
      try {
        setIsLoading(true);
        
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
          const templatesWithVersions = await Promise.all(data.map(async (template) => {
            const { data: versionData, error: versionError } = await supabase
              .from("automation_templates_versions")
              .select("version, status")
              .eq("template_id", template.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            
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

  return { templates, isLoading };
}
