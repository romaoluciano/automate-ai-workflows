
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BoltIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados simulados dos planos
  const plans = [
    {
      name: "Starter",
      price: "R$ 249",
      description: "Ideal para pequenas empresas iniciando a jornada de automação",
      features: [
        "5 automações ativas",
        "1.000 execuções mensais",
        "Modelos básicos",
        "Suporte por e-mail",
      ],
    },
    {
      name: "Business",
      price: "R$ 799",
      description: "Para empresas que precisam escalar seus processos automatizados",
      features: [
        "20 automações ativas",
        "5.000 execuções mensais",
        "Acesso a todos os modelos",
        "Diagnóstico avançado com IA",
        "Suporte prioritário",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "R$ 2.499",
      description: "Solução completa para organizações com necessidades avançadas",
      features: [
        "Automações ilimitadas",
        "Execuções ilimitadas",
        "Modelos exclusivos",
        "Diagnóstico avançado com IA",
        "Consultoria mensal",
        "SLA garantido",
      ],
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular registro
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <BoltIcon className="h-8 w-8 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-primary-700">AutomateAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="link" asChild>
              <Link to="/contato">Contato</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Entre na sua conta para acessar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Senha</Label>
                          <Button variant="link" className="h-auto p-0 text-xs">
                            Esqueceu a senha?
                          </Button>
                        </div>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600"
                        disabled={isLoading}
                      >
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Conta</CardTitle>
                    <CardDescription>
                      Comece a transformar seus processos agora mesmo
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">Nome</Label>
                          <Input id="first-name" placeholder="Seu nome" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Sobrenome</Label>
                          <Input id="last-name" placeholder="Seu sobrenome" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" placeholder="Nome da sua empresa" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <div className="relative">
                          <LockClosedIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Mínimo de 8 caracteres, incluindo uma letra maiúscula e um número
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600"
                        disabled={isLoading}
                      >
                        {isLoading ? "Criando conta..." : "Criar Conta"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="hidden lg:block lg:flex-1 bg-gray-50 p-6">
          <div className="h-full flex flex-col justify-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Escolha o plano ideal para seu negócio</h2>
            <div className="grid gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`overflow-hidden ${
                    plan.highlight
                      ? "ring-2 ring-primary-500 shadow-lg"
                      : "shadow"
                  }`}
                >
                  {plan.highlight && (
                    <div className="bg-primary-500 py-1 text-center text-xs font-medium text-white">
                      MAIS POPULAR
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground"> /mês</span>
                    </div>
                    <CardDescription className="mt-1.5">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mr-2 h-4 w-4 text-primary-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={
                        plan.highlight
                          ? "w-full bg-primary-500 hover:bg-primary-600"
                          : "w-full"
                      }
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      Começar Agora
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-gray-50">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-gray-600">
          <div>
            <p>© 2023 AutomateAI. Todos os direitos reservados.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/termos">Termos de Uso</Link>
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/suporte">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
