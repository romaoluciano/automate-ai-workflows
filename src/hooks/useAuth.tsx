
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  email: string;
  name: string;
};

type Partner = {
  id: string;
  user_id: string;
  company_name: string;
  approved_at: string | null;
  status: 'pending' | 'approved' | 'rejected';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isPartner: boolean;
  partnerData: Partner | null;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [partnerData, setPartnerData] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      // Verificar usuário atual
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setUser(null);
        setPartnerData(null);
        return;
      }
      
      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (userError) throw userError;
      
      setUser(userData);
      
      // Verificar se é parceiro
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
        
      if (!partnerError) {
        setPartnerData(partnerData);
      } else {
        setPartnerData(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    }
    
    loadUser();
    
    // Configurar listener de mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await refreshUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setPartnerData(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        await refreshUser();
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPartnerData(null);
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      
      // Criar registro do usuário na tabela users
      if (!error) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          await supabase.from('users').insert({
            id: authUser.id,
            email,
            name,
          });
          
          await refreshUser();
        }
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const isPartner = !!partnerData && partnerData.status === 'approved';

  const value = {
    user,
    loading,
    isPartner,
    partnerData,
    refreshUser,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
