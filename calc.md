# ESPECIFICAÇÃO COMPLETA: CALCULADORA ONLINE I3 SISTEMAS (2026)

Este documento reúne a arquitetura funcional, regras de exibição condicional, fórmulas de cálculo e integração comercial da calculadora interativa para o site da i3 Sistemas, com a chamada para ação (CTA) "Receba a cotação pelo WhatsApp".

---

## 1. VISÃO GERAL E UX/UI
* Formato: Wizard progressivo (Passo a passo em 6 telas).
* Recursos visuais: Barra de progresso, validação de etapas e transições dinâmicas.
* Lógica estrita: Módulos adicionais só são exibidos se forem 100% compatíveis com o segmento, regime e necessidade informados.

---

## 2. FLUXO DE TELAS E CONTEÚDO

### TELA 1: SEGMENTO DE ATUAÇÃO
* Título: "Qual é o ramo da sua empresa?"
* Subtítulo: "Selecione o seu segmento para ajustarmos os recursos ideais à sua rotina."
* Tipo: Seleção única (Cartões clicáveis).
* Opções:
  1. Loja / Varejo
  2. Supermercado / Mercado / Mercearia
  3. Distribuidora / Atacado
  4. Restaurante / Bar / Pizzaria / Lanchonete (Food Service)
  5. Oficina / Assistência Técnica / Manutenção
  6. Prestador de Serviços
  7. Transportadora / Transporte de Cargas
  8. Indústria / Outro Segmento

---

### TELA 2: REGIME TRIBUTÁRIO
* Título: "Qual é o regime tributário da empresa?"
* Subtítulo: "O enquadramento fiscal determina a licença base de gestão e as regras de tributação."
* Tipo: Seleção única.
* Opções:
  1. MEI (Microempreendedor Individual)
  2. Simples Nacional
  3. Lucro Presumido ou Lucro Real (Regime Normal)
  4. Ainda não sei / Quero apenas emissão fiscal simples

---

### TELA 3: NECESSIDADE PRINCIPAL E ESCALA DE USO
* Título: "O que precisa de controlar e quantas pessoas vão utilizar?"
* Subtítulo: "Vamos dimensionar os pontos de acesso e o nível de profundidade da gestão."

* Pergunta 3.1: Necessidade Principal (Seleção única)
  - Apenas emissão fiscal básica (NF-e ou NFC-e)
  - Vendas + Controlo de Estoque
  - Vendas + Estoque + Financeiro
  - Frente de Caixa (PDV) / Balcão com estoque
  - Gestão Completa (Compras, Estoque, Financeiro, Fiscal e Vendas)

* Pergunta 3.2: Quantidade de Usuários / Pontos de Uso (Campo numérico)
  - Elemento: Seletor numérico [- 1 +] ou controle deslizante (Slider).
  - Regra: Mínimo = 1.
  - Legenda: "Considere caixas, gerência, financeiro e retaguarda. Todos os planos incluem 1 usuário base."

---

### TELA 4: MÓDULOS ADICIONAIS (FILTRAGEM CONDICIONAL ESTRITA)
* Título: "Selecione os recursos e rotinas necessárias para a sua operação:"
* Subtítulo: "Exibindo apenas módulos compatíveis com o perfil diagnosticado."
* Regra Geral: Se o usuário selecionou "Apenas emissão fiscal básica" na Tela 3, pular esta tela ou informar que o plano Start Lite dispensa módulos adicionais.

#### Módulos e Condições de Exibição:
1. Pix QR Code PDV (+ R$ 40,00/mês)
   - [Perfil Elegível: Supermercado, Loja/Varejo ou Food Service | Exceto apenas emissão fiscal]
2. TEF PayGo-SiTef (+ R$ 160,00/mês)
   - [Perfil Elegível: Supermercado, Loja/Varejo ou Food Service | Exceto apenas emissão fiscal]
3. Smart TEF POS (+ R$ 120,00/mês)
   - [Perfil Elegível: Loja/Varejo, Food Service ou Supermercado | Exceto apenas emissão fiscal]
4. Gestor Tributário (Simples) (+ R$ 160,00/mês)
   - [Perfil Elegível: Simples Nacional nos ramos de Supermercado, Varejo, Distribuidora ou Indústria]
5. Gestor Tributário (Regime Normal) (+ R$ 240,00/mês)
   - [Perfil Elegível: Lucro Presumido ou Real nos ramos de Supermercado, Varejo, Distribuidora ou Indústria]
6. SPED Fiscal / EFD (+ R$ 140,00/mês)
   - [Perfil Elegível: Lucro Presumido/Real OU Supermercado, Distribuidora ou Indústria]
7. Nota Fiscal de Serviço (NFS-e) (+ R$ 60,00/mês)
   - [Perfil Elegível: Prestador de Serviços ou Oficinas/Assistências Técnicas]
8. Conhecimento de Transporte (CT-e) (+ R$ 60,00/mês)
   - [Perfil Elegível: Transportadoras ou Distribuidoras/Atacado]
9. Manifesto de Cargas (MDF-e) (Sob consulta)
   - [Perfil Elegível: Transportadoras ou Distribuidoras com frota própria]
10. App Mobile - Master Foods / Vendas (+ R$ 15,00/mês por licença)
    - [Perfil Elegível: Food Service (garçom) ou Loja/Varejo (vendedor no salão)]
11. Pedido VIP / Força de Vendas Externa (Sob consulta)
    - [Perfil Elegível: Distribuidora, Atacado ou Indústria com equipe externa]
12. Dashboard Web / Indicadores na Nuvem (+ R$ 60,00/mês)
    - [Perfil Elegível: Planos de gestão intermediária ou completa (Vendas+Estoque+Financeiro ou Gestão Completa)]
13. Mesas, Comandas e Cozinha - Master Foods (Sob consulta)
    - [Perfil Elegível: Restaurante, Bar, Pizzaria ou Lanchonete]
14. Cardápio Digital QR Code (Sob consulta)
    - [Perfil Elegível: Food Service com consumo local/mesas]
15. Integração iFood & WhatsApp Delivery - Anota AI (Sob consulta)
    - [Perfil Elegível: Estabelecimentos de Food Service com delivery]
16. Ordem de Serviço - DAV-OS (Sob consulta)
    - [Perfil Elegível: Oficinas Mecânicas e Assistências Técnicas]
17. Integração com Loja Virtual / E-commerce (Sob consulta)
    - [Perfil Elegível: Loja/Varejo, Distribuidora ou Supermercado]
18. Emissão de Boletos e Integração Serasa (Sob consulta)
    - [Perfil Elegível: Distribuidora/Atacado ou Loja/Varejo com vendas faturadas/a prazo]
19. Sistema de Fidelidade e Cashback (Sob consulta)
    - [Perfil Elegível: Supermercado, Loja/Varejo ou Food Service]

---

### TELA 5: CAPTAÇÃO DE CONTACTO (LEAD GATE)
* Título: "A sua cotação personalizada está pronta!"
* Subtítulo: "Informe os seus dados para enviarmos a proposta oficial e detalhada diretamente para o seu WhatsApp."
* Campos:
  - Nome Completo (Obrigatório)
  - Nome da Empresa (Obrigatório)
  - WhatsApp com DDD (Obrigatório, formato (00) 00000-0000)
  - E-mail (Obrigatório)
* Botão de Ação Principal:
  [ Receba a cotação pelo WhatsApp ]

---

### TELA 6: RESUMO DA COTAÇÃO & REDIRECIONAMENTO
* Alerta de Topo: "Cotação calculada com sucesso! A abrir a sua conversa no WhatsApp..."
* Bloco 1: Perfil Diagnosticado
  - Segmento | Regime Tributário | Quantidade de Usuários
* Bloco 2: Solução Indicada
  - Nome do Plano Base (com lista de funções inclusas)
  - Módulos adicionais contratados
* Bloco 3: Discriminação Financeira Mensal
  - Subtotal Plano Base: R$ [Valor]
  - Subtotal Usuários Extras: R$ [Valor]
  - Subtotal Módulos Adicionais: R$ [Valor]
  - Mensalidade Estimada: R$ [Total]/mês
* Botão de Suporte (Caso o WhatsApp não abra automaticamente):
  [ Receba a cotação pelo WhatsApp ]

---

## 3. REGRAS DE CÁLCULO E PREÇOS (TABELA 2026)

### 3.1. Definição do Plano Base
* Start Lite (iComércio Lite) = R$ 180,00/mês
  - Indicado se necessidade for "Apenas emissão fiscal básica".
* Start MEI (iComércio Gestão) = R$ 200,00/mês
  - Indicado se regime for "MEI".
* Essencial Simples (iComércio Gestão) = R$ 250,00/mês
  - Indicado se regime for "Simples Nacional".
* Avançado Regime Normal (iComércio Gestão) = R$ 280,00/mês
  - Indicado se regime for "Lucro Presumido ou Real".
* Gestão Plus (iComércio Gestão + PDV) = R$ 300,00/mês
  - Indicado para "Supermercado / Mercado / Mercearia" com frente de caixa.

### 3.2. Usuários Extras (acima de 1 incluso)
* De 1 a 4 extras: R$ 25,00 por usuário/mês
* De 5 a 10 extras: R$ 20,00 por usuário/mês
* 11 ou mais extras: R$ 15,00 por usuário/mês

### 3.3. Valores dos Módulos Adicionais (Mensalidade)
* Gestor Tributário (Simples): R$ 160,00
* Gestor Tributário (Regime Normal): R$ 240,00
* Conhecimento de Transporte (CT-e): R$ 60,00
* Nota Fiscal de Serviço (NFS-e): R$ 60,00
* Pix QR Code PDV: R$ 40,00
* SPED Fiscal e EFD: R$ 140,00
* TEF PayGo-SiTef: R$ 160,00
* Smart TEF POS: R$ 120,00
* App Mobile (Master Foods / Vendas): R$ 15,00 por licença
* Dashboard Web: R$ 60,00
* Recursos sob consulta (MDF-e, Pedido VIP, Anota AI, Serasa, Boletos, etc.): Não somam valores numéricos no cálculo automático; são encaminhados para cotação do consultor.

---

## 4. INTEGRAÇÃO E DISPARO DE MENSAGEM NO WHATSAPP

Ao clicar na CTA "Receba a cotação pelo WhatsApp", o link é estruturado via URL:
https://api.whatsapp.com/send?phone=55XXXXXXXXXXX&text=[MENSAGEM_CODIFICADA]

### Template da Mensagem Enviada:
Olá, equipe i3 Sistemas!
Acabei de efetuar a simulação na calculadora do vosso site e solicito a minha cotação oficial:

🏢 DADOS DA EMPRESA:
• Empresa: {nome_empresa}
• Responsável: {nome_responsavel}
• Segmento: {segmento}
• Regime Tributário: {regime}
• Usuários: {total_usuarios} utilizador(es) ({extras} extra(s))

📦 PROPOSTA DIAGNOSTICADA:
• Plano Base: {nome_plano} (R$ {valor_plano})
• Usuários Extras: {extras} un. (R$ {valor_extras})
• Módulos Selecionados:
  - {modulo_1} (R$ {valor_modulo_1})
  - {modulo_2} (R$ {valor_modulo_2})
  (Módulos sob consulta técnica: {modulos_consulta})

💰 TOTAL ESTIMADO: R$ {total_calculado}/mês

Aguardo o envio da proposta formal e o agendamento de uma demonstração!
