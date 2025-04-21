
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  company_name: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  tax_id: z.string().min(11, "CNPJ inválido"),
  website: z.string().url("Website inválido"),
  experience: z.string().min(20, "Por favor, descreva sua experiência com mais detalhes"),
  portfolio: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PartnerApplicationForm() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      tax_id: "",
      website: "",
      experience: "",
      portfolio: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Erro ao enviar aplicação",
        description: "Você precisa estar logado para se aplicar como parceiro.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("partner_applications")
        .insert({
          user_id: user.id,
          company_name: values.company_name,
          tax_id: values.tax_id,
          website: values.website,
          experience: values.experience,
          portfolio: values.portfolio || null,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Aplicação enviada com sucesso!",
        description: "Sua aplicação para se tornar parceiro foi enviada e está em análise.",
      });
      
      form.reset();
      refreshUser();
      
    } catch (error) {
      toast({
        title: "Erro ao enviar aplicação",
        description: "Não foi possível enviar sua aplicação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aplicação para Parceiro</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Sua empresa" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="00.000.000/0000-00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://www.seusite.com.br" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiência em Automação</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva sua experiência com automação de processos"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfólio (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Link para seu portfólio ou cases de sucesso"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full">
                Enviar Aplicação
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
