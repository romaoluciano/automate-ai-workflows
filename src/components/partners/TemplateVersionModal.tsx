
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Versão deve seguir o formato x.y.z"),
  changelog: z.string().min(10, "Notas de versão devem ter pelo menos 10 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

interface Template {
  id: string;
  name: string;
  version: string;
  [key: string]: any;
}

interface TemplateVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
}

export function TemplateVersionModal({ isOpen, onClose, template }: TemplateVersionModalProps) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      version: template ? incrementVersion(template.version || "1.0.0") : "1.0.0",
      changelog: "",
    },
  });

  // Função para incrementar a versão (x.y.z -> x.y.z+1)
  function incrementVersion(version: string): string {
    const parts = version.split(".");
    if (parts.length !== 3) return "1.0.0";
    
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    const patch = parseInt(parts[2], 10) + 1;
    
    return `${major}.${minor}.${patch}`;
  }
  
  React.useEffect(() => {
    if (template) {
      form.setValue("version", incrementVersion(template.version || "1.0.0"));
    }
  }, [template, form]);

  const onSubmit = async (values: FormValues) => {
    if (!template) return;
    
    try {
      // Primeiro obtemos o template atual
      const { data: currentTemplate, error: fetchError } = await supabase
        .from("automation_templates")
        .select("*")
        .eq("id", template.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Criamos uma cópia com nova versão
      // Use "as any" até que os tipos sejam atualizados
      const { error: insertError } = await supabase
        .from("automation_templates_versions" as any)
        .insert({
          template_id: template.id,
          version: values.version,
          previous_version: template.version || "1.0.0",
          changelog: values.changelog,
          json_schema: currentTemplate.json_schema,
          status: "pending",
        });
        
      if (insertError) throw insertError;

      toast({
        title: "Nova versão enviada com sucesso!",
        description: `A versão ${values.version} do template foi enviada para revisão.`,
      });

      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar nova versão",
        description: "Não foi possível enviar a nova versão do template. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Versão do Template</DialogTitle>
          <DialogDescription>
            {template ? `Criar nova versão para "${template.name}"` : "Carregando..."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Versão</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1.0.0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="changelog"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas de Versão</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva as mudanças e melhorias nesta versão"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Enviar Nova Versão
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
