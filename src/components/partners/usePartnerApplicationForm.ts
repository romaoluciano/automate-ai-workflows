
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  company_name: z.string().min(3, "Nome da empresa deve ter pelo menos 3 caracteres"),
  tax_id: z.string().min(11, "CNPJ inválido"),
  website: z.string().url("Website inválido"),
  experience: z.string().min(20, "Por favor, descreva sua experiência com mais detalhes"),
  portfolio: z.string().optional(),
});

export type PartnerApplicationFormValues = z.infer<typeof formSchema>;

export function usePartnerApplicationForm() {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const form = useForm<PartnerApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      tax_id: "",
      website: "",
      experience: "",
      portfolio: "",
    },
  });

  const onSubmit = async (values: PartnerApplicationFormValues) => {
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

  return { form, onSubmit };
}
