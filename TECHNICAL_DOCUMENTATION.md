# BBKits Sistema de Vendas - Documentação Técnica

## Visão Geral

Sistema web completo para controle de vendas e comissões da BBKits, desenvolvido com Laravel 12 + React 19 + Inertia.js.

### Características Principais

- **MVP Funcional**: Sistema completo de vendas com aprovação financeira
- **Gamificação**: Sistema de níveis, rankings e motivação para vendedoras
- **Relatórios Premium**: PDFs com mensagens motivacionais e histórico
- **Mobile-First**: Interface responsiva para celulares e tablets
- **Notificações**: Sistema de notificações em tempo real
- **Export**: Exportação para Excel/CSV dos relatórios

## Stack Tecnológica

### Backend
- **Laravel 12.19.3** - Framework PHP
- **PHP 8.2+** - Linguagem de programação
- **SQLite/PostgreSQL** - Banco de dados
- **Laravel Sanctum** - Autenticação API
- **Laravel Breeze** - Scaffolding de autenticação
- **DomPDF** - Geração de relatórios PDF

### Frontend
- **React 19.1.0** - Biblioteca JavaScript
- **Inertia.js** - Framework SPA server-driven
- **Tailwind CSS 3.2** - Framework CSS utilitário
- **Headless UI** - Componentes UI acessíveis
- **React Hot Toast** - Notificações toast
- **Hero Icons** - Biblioteca de ícones

### DevOps & Deploy
- **Docker** - Containerização
- **Render.com** - Hospedagem na nuvem
- **GitHub Actions** - CI/CD (se configurado)

## Estrutura do Projeto

```
BBKits/
├── app/
│   ├── Http/Controllers/
│   │   ├── AdminController.php
│   │   ├── SaleController.php
│   │   ├── ExportController.php
│   │   └── NotificationController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Sale.php
│   │   ├── Commission.php
│   │   └── Notification.php
│   ├── Services/
│   │   ├── CommissionService.php
│   │   ├── GamificationService.php
│   │   ├── PDFReportService.php
│   │   ├── ExcelExportService.php
│   │   └── NotificationService.php
│   └── Policies/
│       └── SalePolicy.php
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── ResponsiveTable.jsx
│   │   │   ├── ResponsiveForm.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── Pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sales/
│   │   │   └── Admin/
│   │   └── Layouts/
│   └── views/
│       └── reports/
├── database/
│   ├── migrations/
│   └── seeders/
└── docker/
```

## Instalação e Configuração

### Pré-requisitos

- PHP 8.2+
- Composer
- Node.js 18+
- NPM
- Docker (opcional)

### Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd BBKits
```

2. **Instale dependências**
```bash
composer install
npm install
```

3. **Configure ambiente**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure banco de dados**
```bash
# No .env, configure:
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite

# Ou para PostgreSQL:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bbkits
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Execute migrações e seeders**
```bash
php artisan migrate --seed
```

6. **Configure storage**
```bash
php artisan storage:link
```

7. **Compile assets**
```bash
npm run dev
# ou para produção:
npm run build
```

8. **Inicie o servidor**
```bash
php artisan serve
```

### Deploy no Render.com

1. **Conecte o repositório** ao Render.com
2. **Configure as variáveis de ambiente** (ver `render.yaml`)
3. **Deploy automático** será executado

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/login` | Página de login |
| POST | `/login` | Processar login |
| POST | `/logout` | Logout |
| GET | `/register` | Página de registro |
| POST | `/register` | Processar registro |

### Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Dashboard do usuário |
| GET | `/admin/dashboard` | Dashboard administrativo |

### Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/sales` | Listar vendas do usuário |
| GET | `/sales/create` | Formulário de nova venda |
| POST | `/sales` | Criar nova venda |
| GET | `/sales/{id}` | Visualizar venda |
| GET | `/sales/{id}/edit` | Editar venda |
| PUT | `/sales/{id}` | Atualizar venda |
| DELETE | `/sales/{id}` | Excluir venda |

### Administração (Admin/Financeiro)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/sales` | Lista vendas para aprovação |
| POST | `/admin/sales/{id}/approve` | Aprovar venda |
| POST | `/admin/sales/{id}/reject` | Rejeitar venda |

### Relatórios

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/reports/sales` | Relatório de vendas (PDF) |
| GET | `/reports/commission` | Relatório de comissões (PDF) |
| GET | `/admin/reports/team` | Relatório da equipe (PDF) |

### Exportação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/admin/export/sales` | Exportar vendas (Excel/CSV) |
| GET | `/admin/export/commissions` | Exportar comissões (Excel/CSV) |

### Notificações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notifications` | Listar notificações |
| GET | `/notifications/unread-count` | Contador não lidas |
| POST | `/notifications/{id}/read` | Marcar como lida |
| POST | `/notifications/mark-all-read` | Marcar todas como lidas |

## Modelos de Dados

### User
```php
- id (int)
- name (string)
- email (string)
- role (enum: vendedora, admin, financeiro)
- email_verified_at (timestamp)
- password (string)
- created_at (timestamp)
- updated_at (timestamp)
```

### Sale
```php
- id (int)
- user_id (foreign key)
- client_name (string)
- total_amount (decimal)
- shipping_amount (decimal)
- payment_method (enum: pix, boleto, cartao, dinheiro)
- received_amount (decimal)
- payment_date (date)
- payment_receipt (string, arquivo)
- notes (text, nullable)
- status (enum: pendente, aprovado, recusado)
- approved_by (foreign key, nullable)
- approved_at (timestamp, nullable)
- rejected_by (foreign key, nullable)
- rejected_at (timestamp, nullable)
- rejection_reason (string, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Commission
```php
- id (int)
- sale_id (foreign key)
- user_id (foreign key)
- base_amount (decimal)
- percentage (decimal)
- value (decimal)
- month (int)
- year (int)
- created_at (timestamp)
- updated_at (timestamp)
```

### Notification
```php
- id (int)
- user_id (foreign key)
- type (string)
- message (text)
- data (json)
- read (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

## Fluxos de Trabalho do Sistema

### 1. Fluxo de Vendas e Pagamentos

#### Criação da Venda
1. **Vendedora** cria pedido com detalhes do produto e cliente
2. **Sistema** gera token único para rastreamento (`unique_token`)
3. **Cliente** pode completar endereço via link personalizado: `/pedido/{token}`

#### Verificação de Pagamento
1. **Cliente** envia comprovante de pagamento (qualquer valor)
2. **Admin Financeiro** revisa e aprova o pagamento processado
3. **Não há valores fixos** de 50% ou 100% - o sistema aceita qualquer quantia
4. **Produção inicia** imediatamente após aprovação financeira
5. **Pagamento restante** pode ser processado antes ou após aprovação da foto

### 2. Fluxo de Produção e Aprovação de Foto

#### Processo de Produção
1. **Admin de Produção** inicia produção após aprovação financeira
2. **Sistema** valida informações obrigatórias (nome, bordado, etc.)
3. **Endereço de entrega** é opcional para início da produção
4. **Admin** fotografa produto finalizado e envia para aprovação

#### Aprovação da Foto pelo Cliente
1. **Cliente** acessa link personalizado: `/pedido/{token}`
2. **Sistema** exibe foto do produto finalizado
3. **Cliente** pode:
   - ✅ **Aprovar** a foto (pedido avança)
   - ❌ **Solicitar ajustes** com motivo específico
4. **Se rejeitada**: Pedido retorna para produção com feedback
5. **Se aprovada**: Sistema verifica se precisa de pagamento final

### 3. Sistema de Entrega e Rastreamento

#### Integração Híbrida com Tiny ERP
1. **Sistema principal**: Integração com Tiny ERP para NF-e e etiquetas
2. **Sistema de backup**: Geração interna caso Tiny ERP falhe
3. **Endereço obrigatório** apenas na etapa de envio (não na produção)

#### Geração de Nota Fiscal
- **Tentativa primária**: API Tiny ERP gera NF-e oficial
- **Fallback automático**: Sistema gera número interno `NF-YYYY-000001`
- **Sempre funciona**: Sistema nunca falha por problemas de ERP

#### Geração de Etiqueta de Envio
- **Tentativa primária**: Tiny ERP gera etiqueta dos Correios
- **Fallback automático**: Sistema gera código interno `BB000001BR`
- **Rastreamento garantido**: Cliente sempre recebe código de rastreio

#### Notificação do Cliente
1. **Link personalizado** atualizado com informações de envio
2. **WhatsApp** envia código de rastreamento automaticamente
3. **Sistema resiliente** funciona independente de falhas externas

### 4. Experiência do Cliente via Link Personalizado

#### Funcionalidades Disponíveis
- **Visualizar** status em tempo real do pedido
- **Completar** endereço de entrega (se necessário)
- **Enviar** comprovantes de pagamento adicional
- **Aprovar/rejeitar** foto do produto
- **Acompanhar** código de rastreamento

#### Estados do Pedido Visíveis
- `pending_payment` - Aguardando pagamento
- `payment_approved` - Pagamento aprovado, em produção
- `in_production` - Produto sendo confeccionado
- `photo_sent` - Foto enviada para aprovação
- `photo_approved` - Foto aprovada pelo cliente
- `pending_final_payment` - Aguardando pagamento final (se necessário)
- `ready_for_shipping` - Pronto para envio
- `shipped` - Enviado com código de rastreamento

## Regras de Negócio

### Sistema de Comissões

1. **Faixas de Comissão**:
   - R$ 40.000 - R$ 49.999: 2%
   - R$ 50.000 - R$ 59.999: 3%
   - R$ 60.000 ou mais: 4%

2. **Base de Cálculo**: Valor recebido - valor do frete

3. **Condições**:
   - Comissão só é liberada após aprovação financeira
   - Meta mínima individual: R$ 40.000
   - Meta coletiva da empresa: R$ 220.000

### Sistema de Gamificação

1. **Níveis de Performance**:
   - **Iniciante**: < R$ 40.000
   - **Intermediária**: R$ 40.000 - R$ 49.999
   - **Avançada**: R$ 50.000 - R$ 59.999
   - **Elite**: R$ 60.000+

2. **Features Motivacionais**:
   - Rankings mensais
   - Mensagens personalizadas por performance
   - Badges de conquistas
   - Progressão visual de metas

### Permissões por Perfil

1. **Vendedora**:
   - Criar, editar, excluir próprias vendas (apenas pendentes)
   - Visualizar dashboard pessoal
   - Gerar relatórios próprios
   - Receber notificações

2. **Financeiro**:
   - Aprovar/rejeitar vendas
   - Visualizar todas as vendas
   - Gerar relatórios da equipe
   - Exportar dados

3. **Admin**:
   - Todas as permissões do Financeiro
   - Gerenciar usuários
   - Configurações do sistema

## Componentes Principais

### Services

#### CommissionService
- Cálculo de comissões por vendedora
- Verificação de metas atingidas
- Histórico de comissões

#### GamificationService
- Sistema de níveis e badges
- Rankings dinâmicos
- Mensagens motivacionais

#### PDFReportService
- Geração de relatórios em PDF
- Templates personalizados
- Histórico de performance

#### NotificationService
- Notificações em tempo real
- Gerenciamento de status lido/não lido
- Tipos de notificação

### Componentes React

#### ResponsiveTable
- Tabela adaptativa para mobile
- Expansão de linhas em dispositivos pequenos
- Colunas configuráveis

#### NotificationBell
- Componente de notificações
- Polling automático
- Dropdown com ações

#### ResponsiveForm
- Formulários mobile-first
- Validação em tempo real
- Layout adaptativo

## Configuração de Ambiente

### Variáveis de Ambiente (.env)

```env
APP_NAME="BBKits"
APP_ENV=production
APP_KEY=base64:generated_key
APP_DEBUG=false
APP_URL=https://bbkits.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=rendered_host
DB_PORT=5432
DB_DATABASE=bbkits
DB_USERNAME=rendered_user
DB_PASSWORD=rendered_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@bbkits.com"
MAIL_FROM_NAME="BBKits"
```

## Monitoramento e Logs

### Log Files
- `storage/logs/laravel.log` - Logs da aplicação
- `storage/logs/daily/` - Logs diários

### Métricas Importantes
- Número de vendas por dia/mês
- Taxa de aprovação de vendas
- Comissões pagas por período
- Performance por vendedora

## Segurança

### Implementações
- Autenticação via Laravel Sanctum
- Policies para controle de acesso
- Validação de dados de entrada
- CSRF Protection
- Rate Limiting (se configurado)

### Boas Práticas
- Senhas hasheadas
- Validação de arquivos upload
- Sanitização de dados
- Headers de segurança

## Backup e Manutenção

### Backup Automático
- Banco de dados via Render.com
- Storage de arquivos (comprovantes)

### Manutenção Programada
- Limpeza de logs antigos
- Otimização de cache
- Atualização de dependências

## Troubleshooting

### Problemas Comuns

1. **Erro 500**: Verificar logs em `storage/logs/`
2. **Uploads não funcionam**: Verificar permissões da pasta `storage/`
3. **PDFs não geram**: Verificar extensão PHP GD
4. **Assets não carregam**: Executar `npm run build`

### Comandos Úteis

```bash
# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Recriar banco de dados
php artisan migrate:fresh --seed

# Verificar status
php artisan about

# Logs em tempo real
tail -f storage/logs/laravel.log
```

## Contato e Suporte

Para questões técnicas ou suporte, contate o desenvolvedor responsável pelo projeto BBKits.

---

**Documentação gerada automaticamente pelo Sistema BBKits**
*Versão: 1.0.0 | Data: Janeiro 2025*