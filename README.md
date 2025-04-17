
# AutomateAI - Transformando processos em vantagem competitiva

![AutomateAI](https://lovable.dev/opengraph-image-p98pqg.png)

AutomateAI é uma plataforma SaaS B2B que ajuda pequenas e médias empresas a automatizarem seus processos operacionais com uso de IA, sem exigir conhecimentos técnicos. Nossa solução combina diagnóstico inteligente, editor visual no-code, monitoramento de ROI e um marketplace de templates para transformar a eficiência operacional em vantagem competitiva.

## 🎯 Público-Alvo

- PMEs em transformação digital (20 a 200 colaboradores)
- Escritórios de contabilidade, consultorias e clínicas
- E-commerces e varejo com alta repetição de tarefas

## 🚀 Funcionalidades do MVP

1. **Diagnóstico com IA**
   - Análise de processos atuais
   - Recomendações inteligentes de automação
   - Estimativa de ganhos e ROI

2. **Editor Visual de Automações**
   - Interface drag-and-drop para criação de fluxos
   - Conectores pré-construídos
   - Sem necessidade de código

3. **Monitoramento e Alertas**
   - Dashboard com métricas de desempenho
   - Alertas inteligentes de falhas
   - Análise de ganhos

4. **Marketplace de Templates**
   - Soluções pré-construídas por setor
   - Templates gratuitos e premium
   - Rápida implementação

## 🧱 Arquitetura do Projeto

### Frontend

- **Framework**: React.js com TypeScript
- **UI Library**: Tailwind CSS + shadcn components
- **Roteamento**: React Router
- **Estado**: React Hooks
- **Gráficos**: Recharts
- **Editor de Fluxo**: @xyflow/react

### Backend (Planejado)

- **Runtime**: Node.js + Express
- **Autenticação**: Auth0/Firebase Auth
- **Banco de Dados**: PostgreSQL + MongoDB
- **IA**: OpenAI API
- **Processamento de Automações**: n8n/Make integration

## 📦 Estrutura do Projeto

```
/src
  /components
    /automation - Componentes do editor de fluxo
    /dashboard - Componentes do dashboard
    /layout - Componentes estruturais (sidebar, layout)
    /ui - Componentes de UI reutilizáveis
  /hooks - React hooks customizados
  /lib - Utilitários e funções auxiliares
  /pages - Páginas da aplicação
  /services - Serviços e integrações de API
```

## 📋 Guia de Desenvolvimento

### Requisitos

- Node.js 16+
- npm, yarn ou pnpm

### Instalação

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# Instalar dependências
npm install
# ou
yarn
# ou
pnpm install

# Iniciar em modo de desenvolvimento
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

## 📚 Banco de Dados (Planejado)

O banco de dados PostgreSQL planejado terá o seguinte esquema:

```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planos
CREATE TABLE plans (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  automations_limit INTEGER NOT NULL,
  executions_limit INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assinaturas
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES plans(id),
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  renewed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automações
CREATE TABLE automations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  json_schema JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates de Automação
CREATE TABLE automation_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_by_user UUID REFERENCES users(id),
  json_schema JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Execuções
CREATE TABLE executions (
  id UUID PRIMARY KEY,
  automation_id UUID REFERENCES automations(id),
  status VARCHAR(50) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alertas
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  execution_id UUID REFERENCES executions(id),
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 API Endpoints (Planejados)

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/logout` - Logout de usuário
- `GET /api/auth/me` - Dados do usuário autenticado

### Automações

- `GET /api/automations` - Listar automações do usuário
- `GET /api/automations/:id` - Obter detalhes de uma automação
- `POST /api/automations` - Criar nova automação
- `PUT /api/automations/:id` - Atualizar automação existente
- `DELETE /api/automations/:id` - Excluir automação
- `PATCH /api/automations/:id/status` - Ativar/desativar automação

### Execuções

- `POST /api/executions/trigger/:automationId` - Acionar execução manualmente
- `GET /api/executions` - Listar execuções de automações
- `GET /api/executions/:id` - Obter detalhes de uma execução

### Templates

- `GET /api/templates` - Listar templates disponíveis
- `GET /api/templates/:id` - Obter detalhes de um template
- `POST /api/templates/:id/clone` - Clonar template para automações do usuário

### Diagnóstico

- `POST /api/diagnosis` - Submeter informações para diagnóstico
- `GET /api/diagnosis/:id` - Obter resultados de um diagnóstico

## 💵 Modelo de Negócios

### Planos de Assinatura

1. **Starter – R$249/mês**
   - 5 automações
   - 1.000 execuções mensais
   - Modelos básicos
   - Suporte por e-mail

2. **Business – R$799/mês**
   - 20 automações
   - 5.000 execuções mensais
   - Acesso a todos os modelos
   - Diagnóstico avançado com IA
   - Suporte prioritário

3. **Enterprise – R$2.499/mês**
   - Automações ilimitadas
   - Execuções ilimitadas
   - Modelos exclusivos
   - Diagnóstico avançado com IA
   - Consultoria mensal
   - SLA garantido

### Serviços Adicionais

- **Treinamento**: R$5.000 - R$20.000
- **Execuções adicionais**: R$99/1.000
- **Templates premium**: Receita para parceiros (comissão 25%)

## 📅 Roadmap de Desenvolvimento

### Fase 1 (MVP - Meses 1-2)
- Wireframes e protótipos
- Setup de infraestrutura
- Arquitetura de dados

### Fase 2 (Meses 3-4)
- Diagnóstico funcional
- Editor de automações
- Execução básica via integrações

### Fase 3 (Meses 5-6)
- Dashboards e alertas
- Marketplace funcional
- Beta com 5-10 clientes reais

### Fase 4 (Pós-MVP)
- API pública para desenvolvedores
- Motor de execução próprio
- Marketplace para parceiros
- Integrações nativas com ERPs

## 🧪 Testes

```bash
# Executar testes unitários
npm run test
# ou
yarn test
```

## 🚀 Deploy

O AutomateAI pode ser implantado em diversas plataformas de nuvem:

- AWS (EC2, ECS, Fargate)
- Google Cloud Platform (GKE, Cloud Run)
- Azure (AKS, App Service)
- Também suporta deploy via Docker em qualquer provedor compatível

## 📝 Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE)

---

Desenvolvido com 💜 pela equipe AutomateAI
