
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Define the schema with proper typing
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  tags: z.string().transform((str) => str.split(",").map((s) => s.trim())),
  isPremium: z.boolean().default(false),
  price: z.string().optional().transform(val => val ? parseFloat(val) : 0),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Versão deve seguir o formato x.y.z").default("1.0.0"),
});

// Define proper types for the form values
type FormValues = {
  name: string;
  description: string;
  category: string;
  tags: string; // Keep as string for form input
  isPremium: boolean;
  price: string;
  version: string;
};

// Type for the processed form values after Zod transformation
type ProcessedFormValues = z.infer<typeof formSchema>;

interface TemplateSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  isPartnerSubmission?: boolean;
}

export function TemplateSubmissionForm({ 
  isOpen, 
  onClose, 
  categories,
  isPartnerSubmission = false
}: TemplateSubmissionFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      tags: "", // This is a string input initially
      isPremium: false,
      price: "",
      version: "1.0.0",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Erro ao submeter template",
        description: "Você precisa estar autenticado para submeter um template.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a properly typed object with all required fields explicitly defined
      const transformedValues: ProcessedFormValues = {
        name: values.name,
        description: values.description,
        category: values.category,
        tags: values.tags.split(",").map((tag) => tag.trim()), // Convert to array
        isPremium: values.isPremium,
        price: parseFloat(values.price || "0"),
        version: values.version,
      };

      // 1. Inserir o template principal
      const { data: templateData, error: templateError } = await supabase
        .from("automation_templates")
        .insert({
          name: transformedValues.name,
          description: transformedValues.description,
          category: transformedValues.category,
          tags: transformedValues.tags, // Now correctly typed as string[]
          is_premium: transformedValues.isPremium,
          price: transformedValues.price,
          status: isPartnerSubmission ? "pending" : "draft",
          version: transformedValues.version,
          json_schema: {},
          created_by_user: user.id,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      toast({
        title: isPartnerSubmission ? "Template submetido com sucesso!" : "Template salvo como rascunho!",
        description: isPartnerSubmission ? 
          "Seu template será revisado antes de ser publicado." : 
          "Você pode continuar editando o template antes de publicá-lo.",
      });

      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao submeter template",
        description: "Não foi possível submeter o template. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submeter Novo Template</DialogTitle>
          <DialogDescription>
            {isPartnerSubmission ? 
              "Crie e compartilhe seu template de automação no marketplace." :
              "Compartilhe seu template de automação com a comunidade."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Template</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex: email, onboarding, clientes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Versão Inicial</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="1.0.0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPartnerSubmission && (
              <>
                <FormField
                  control={form.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsPremium(checked === true);
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Template Premium</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Marque esta opção se deseja vender este template.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {isPremium && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button type="submit">
                {isPartnerSubmission ? "Submeter Template" : "Salvar Rascunho"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
