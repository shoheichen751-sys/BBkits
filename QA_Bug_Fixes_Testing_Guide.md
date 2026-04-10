# BBKits - Guia de Teste de Correções de Bugs
## QA Bug Fixes Testing Guide

**Data:** 10 de Abril de 2026
**Versão:** 1.0

---

## Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@bbkits.com | admin123 |
| Vendedora | vendedora@bbkits.com | vendedora123 |
| Financeiro | financeiro@bbkits.com | financeiro123 |

---

## BUG-01: Produtos - CRUD Corrigido

**Problema Original:** Página de produtos não carregava dados corretamente, erros ao criar/editar/deletar.

**Como Testar:**

1. Login como **admin@bbkits.com**
2. Acesse o menu **Admin > Produtos** ou vá para `/admin/products`
3. **Criar Produto:**
   - Clique em "Novo Produto"
   - Preencha os campos:
     - Nome: `Kit Teste QA`
     - Preço Base: `150.00`
     - Tamanhos: Selecione P, M, G
     - Cores: Selecione algumas cores
   - Clique em "Salvar"
   - **Esperado:** Produto criado com sucesso, aparece na lista

4. **Editar Produto:**
   - Clique no botão "Editar" de um produto
   - Altere o nome ou preço
   - Salve
   - **Esperado:** Alterações salvas corretamente

5. **Deletar Produto:**
   - Clique no botão "Excluir" de um produto
   - Confirme a exclusão
   - **Esperado:** Produto removido da lista

---

## BUG-06: Comprovantes de Pagamento

**Problema Original:** Erro "Invalid URL" ao clicar em "Registrar Pagamento".

**Como Testar:**

1. Login como **vendedora@bbkits.com**
2. Vá para `/sales`
3. Encontre uma venda existente
4. Clique no botão **"Pagamentos"** (ícone $)
5. Na página de pagamentos, clique em **"Adicionar Pagamento"**
6. Preencha:
   - Valor: `100.00`
   - Data: Data atual
   - Método: PIX
   - Comprovante: Selecione uma imagem (JPG/PNG) ou PDF
   - Observações: `Teste de pagamento`
7. Clique em **"Registrar Pagamento"**

**Esperado:**
- Modal abre sem erros
- Pagamento é registrado com sucesso
- Comprovante é salvo

---

## BUG-07: Cancelamento de Venda (Senha Admin)

**Problema Original:** Vendedora precisava de senha admin para cancelar suas próprias vendas pendentes.

**Como Testar:**

1. Login como **vendedora@bbkits.com**
2. Vá para `/sales/create` e crie uma nova venda:
   - Cliente: `Cliente Teste Cancelamento`
   - Telefone: `11999999999`
   - Produto: Selecione qualquer produto
   - Valor: `200.00`
3. Após criar, vá para `/sales`
4. Encontre a venda recém-criada (status: Pendente)
5. Clique no botão **"Cancelar"**

**Esperado:**
- Modal de cancelamento aparece
- **SEM campo de senha de administrador** (mensagem verde)
- Apenas campo de "Motivo do Cancelamento"
- Digite um motivo com 10+ caracteres
- Clique em "Confirmar Cancelamento"
- Venda é cancelada com sucesso

**Teste Adicional (venda de outro usuário):**
- Se tentar cancelar venda de outro usuário, o campo de senha admin DEVE aparecer

---

## BUG-08: Redirecionamento Após Cancelamento

**Problema Original:** Após cancelar, usuário era redirecionado para página inexistente.

**Como Testar:**

1. Login como **vendedora@bbkits.com**
2. Crie uma nova venda pendente
3. Cancele a venda (seguindo passos do BUG-07)

**Esperado:**
- Após cancelar, você é redirecionado para `/sales` (lista de vendas)
- Mensagem de sucesso: "Venda cancelada com sucesso"
- **NÃO** deve mostrar erro 404 ou página em branco

---

## BUG-09/10: Progresso de Pagamento

**Problema Original:** Barra de progresso mostrava 0% mesmo com pagamentos realizados.

**Como Testar:**

1. Login como **vendedora@bbkits.com**
2. Vá para `/sales/create`
3. Crie uma nova venda COM pagamento inicial:
   - Cliente: `Cliente Teste Progresso`
   - Telefone: `11888888888`
   - Valor Total: `1000.00`
   - Valor Recebido: `500.00` (50% do total)
   - Método: PIX
4. Após criar, vá para `/sales`
5. Clique em **"Pagamentos"** da venda criada

**Esperado:**
- Barra de progresso mostra **50%** (não 0%)
- Valor Pago: R$ 500,00
- Valor Restante: R$ 500,00

**Nota:** Pagamentos <= R$ 5.000 são aprovados automaticamente. Pagamentos maiores ficam pendentes até aprovação do financeiro.

---

## BUG-11: Status do Pedido Inconsistente

**Problema Original:** Labels de status diferentes entre backend e frontend.

**Como Testar:**

1. Login como **admin@bbkits.com**
2. Vá para `/kanban` (Quadro Kanban)
3. Verifique os títulos das colunas:

| Status | Label Correto |
|--------|---------------|
| pending_payment | Aguardando Pagamento |
| payment_approved | Pagamento Aprovado |
| in_production | Em Produção |
| **photo_sent** | **Aguardando Aprovação da Cliente** |
| **photo_approved** | **Foto Aprovada** |
| pending_final_payment | Pagamento Final |
| ready_for_shipping | Pronto para Envio |
| shipped | Enviado |

4. Acesse a página do cliente de uma venda (link único enviado ao cliente)
5. Verifique se o status exibido corresponde à tabela acima

**Esperado:**
- `photo_sent` = "Aguardando Aprovação da Cliente" (foto foi enviada, aguarda cliente aprovar)
- `photo_approved` = "Foto Aprovada" (cliente já aprovou)

---

## Resumo dos Bugs Corrigidos

| Bug | Descrição | Status |
|-----|-----------|--------|
| BUG-01 | Produtos CRUD não funcionava | CORRIGIDO |
| BUG-02 | Produtos não apareciam em /sales/create | Já funcionava |
| BUG-03 | Vendedora não podia editar venda | Já funcionava |
| BUG-04 | Endereço não salvava | Já funcionava |
| BUG-06 | Erro ao registrar pagamento | CORRIGIDO |
| BUG-07 | Cancelar exigia senha admin | CORRIGIDO |
| BUG-08 | Redirecionamento errado após cancelar | CORRIGIDO |
| BUG-09/10 | Progresso de pagamento 0% | CORRIGIDO |
| BUG-11 | Status inconsistente | CORRIGIDO |

---

## Contato para Suporte

Se encontrar problemas durante os testes, entre em contato:
- Email: suporte@bbkits.com
- Sistema: https://bbkits.onrender.com

---

*Documento gerado em 10/04/2026*
