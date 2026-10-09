const state = {
  currentScreen: 1,
  data: {
    segmento: '',
    regime: '',
    necessidade: '',
    usuarios: 1,
    modulos: {},
    cardapioPlano: '',
    lead: {
      nome: '',
      empresa: '',
      whatsapp: '',
      email: ''
    }
  },
  resultado: {
    nomePlano: '',
    valorPlano: 0,
    extras: 0,
    valorExtras: 0,
    modulosNomes: [],
    modulosValores: [],
    modulosConsulta: [],
    valorModulos: 0,
    totalCalculado: 0
  }
};

const appContainer = document.getElementById('app-container');
const shareDialog = document.getElementById('share-dialog');
const shareDialogTitle = document.getElementById('share-dialog-title');
const shareDialogFields = document.getElementById('share-dialog-fields');
const shareDialogStatus = document.getElementById('share-dialog-status');
const shareCopyAllButton = document.getElementById('share-copy-all');
const shareOpenTargetButton = document.getElementById('share-open-target');
let activeShare = null;
const segmentosScripts = {
  varejo: {
    nome: 'Loja / Varejo',
    ativa: `GATILHO DE ATENÇÃO: Falta de controle de grade (tamanhos/cores) e lentidão no caixa.\n\n"Olá, [Nome do Responsável], tudo bem? Aqui é da i3 Sistemas! Atendemos lojas de varejo que precisam controlar estoque por tamanho e cor sem perder horas contando peças. Quando um cliente pede um item, sua equipe consulta o estoque pelo sistema ou precisa procurar no depósito? Quantos caixas ou vendedores operam hoje?`,
    recebida: `POSTURA DE AUTORIDADE: Qualificação rápida de balcão e retaguarda.\n\n"i3 Sistemas, bom dia/boa tarde! Com quem tenho o prazer de falar? Qual é o segmento da sua loja? Quem nos procura no varejo geralmente quer agilizar o balcão e evitar furos de estoque. Qual é hoje a maior dificuldade com o sistema atual?`,
    whatsapp: `Olá! Tudo bem? Aqui é da equipe i3 Sistemas.\n\nAjudamos lojas com controle de grade por cor e tamanho, comissão de vendedores e emissão ágil de NFC-e.\n\nQual é hoje o maior desafio da sua loja: estoque, fechamento de caixa ou lentidão no sistema?`,
    presencial: `"Boa tarde! Vim conhecer a loja. Como vocês controlam o estoque por tamanho e cor e acompanham a comissão dos vendedores? O fechamento do dia ainda depende de papel e planilha?"`
  },
  supermercado: {
    nome: 'Supermercado / Mercado / Mercearia',
    ativa: `GATILHO DE ATENÇÃO: Filas nos horários de pico, tributação de produtos e conferência de Pix.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Mercados precisam de um PDV ágil para evitar filas, especialmente nos horários de pico. Vocês já usam importação de XML e TEF/Pix integrado no caixa ou ainda conferem pagamentos manualmente?`,
    recebida: `POSTURA DE AUTORIDADE: Identificação de escala e periféricos.\n\n"i3 Sistemas, tudo bem? Em mercados, cada segundo no caixa conta para evitar filas. Quantos checkouts vocês operam? Usam balança integrada ou etiquetadora no açougue e hortifrúti?`,
    whatsapp: `Olá! Que bom ter você por aqui.\n\nNosso PDV para mercados oferece leitura de código de barras e integração com balanças, TEF e Pix dinâmico no caixa.\n\nQuantos caixas de atendimento estão em operação hoje?`,
    presencial: `"Boa tarde! Como o sistema responde nos horários de pico? O PDV continua funcionando quando a internet oscila? Podemos conversar sobre contingência, integração com balanças e velocidade no caixa."`
  },
  atacado: {
    nome: 'Distribuidora / Atacado',
    ativa: `GATILHO DE ATENÇÃO: Faturamento em lote, expedição e pedidos externos.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Atendemos distribuidoras que precisam agilizar o faturamento e a liberação de cargas. Seus vendedores fazem pedidos por aplicativo ou enviam fotos de talões para a retaguarda digitar?`,
    recebida: `POSTURA DE AUTORIDADE: Foco em logística e força de vendas.\n\n"i3 Sistemas, prazer em falar com você. Na distribuição, é importante sincronizar estoque, faturamento e financeiro. Vocês precisam emitir NF-e em lote e controlar limite de crédito, ou buscam principalmente força de vendas externa?`,
    whatsapp: `Olá! Seja bem-vindo à i3 Sistemas.\n\nPara distribuidoras e atacadistas, temos recursos para vendedores externos, emissão de NF-e em lote, romaneio, MDF-e e contas a receber.\n\nSua equipe vende externamente ou atende pedidos internos e de balcão?`,
    presencial: `"Boa tarde! Como funciona hoje o processo entre fechar um pedido e liberar a mercadoria na expedição? Quanto tempo a equipe gasta redigitando pedidos ou separando cargas manualmente?"`
  },
  food: {
    nome: 'Restaurante / Bar / Pizzaria / Lanchonete',
    ativa: `GATILHO DE ATENÇÃO: Erros de anotação, demora na cozinha e operação de delivery.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Em horários movimentados, pedidos podem demorar ou chegar incorretos à cozinha. Com a solução Master Foods, o garçom registra a comanda pelo celular e o pedido segue para a produção. Como vocês controlam mesas, comandas e delivery hoje?`,
    recebida: `POSTURA DE AUTORIDADE: Divisão do fluxo entre salão e delivery.\n\n"i3 Sistemas, prazer em atender você. Para alimentação temos comanda mobile, mapa de mesas, impressão por setor e recursos de delivery. Sua maior demanda está no salão, no balcão ou nas entregas?`,
    whatsapp: `Olá! Tudo bem?\n\nA solução i3 para alimentação inclui:\n• Comanda mobile para garçons\n• Impressão de pedidos na cozinha e no bar\n• Cardápio digital por QR Code\n\nSua operação trabalha mais com mesas, balcão ou delivery?`,
    presencial: `"Boa tarde! Como funciona a comunicação entre o salão e a cozinha nos horários de pico? Os pedidos chegam por impressora ou tablet, ou a equipe ainda leva comandas de papel?"`
  },
  oficina: {
    nome: 'Oficina / Assistência Técnica',
    ativa: `GATILHO DE ATENÇÃO: Controle de peças, mão de obra e ordens de serviço.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Oficinas precisam organizar peças, serviços e documentos fiscais sem alternar entre vários programas. Como vocês registram e acompanham as ordens de serviço atualmente?`,
    recebida: `POSTURA DE AUTORIDADE: Peças versus mão de obra.\n\n"i3 Sistemas, que bom que ligou. Para oficinas e assistências, é importante acompanhar o status do serviço e o histórico do cliente. Vocês também vendem peças e acessórios no balcão?`,
    whatsapp: `Olá! Tudo bem?\n\nNosso sistema para oficinas e assistências oferece:\n• Ordem de serviço e envio de orçamento\n• Controle de peças e histórico de atendimento\n• Organização da emissão fiscal de produtos e serviços\n\nHoje vocês usam papel ou um sistema para controlar as OSs?`,
    presencial: `"Boa tarde! Quando um cliente pergunta pelo andamento do serviço ou pelo histórico de uma revisão, sua equipe encontra a informação rapidamente no sistema ou precisa procurar uma pasta física?"`
  },
  servicos: {
    nome: 'Prestador de Serviços',
    ativa: `GATILHO DE ATENÇÃO: Emissão de NFS-e e organização de cobranças recorrentes.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Muitos prestadores perdem tempo emitindo notas no portal da prefeitura e conferindo pagamentos manualmente. Como vocês fazem hoje a gestão de cobrança e das notas de serviço?`,
    recebida: `POSTURA DE AUTORIDADE: Frequência de faturamento.\n\n"i3 Sistemas, bom dia/boa tarde! No ramo de serviços, agilidade na emissão de NFS-e e organização financeira fazem diferença. Que tipo de serviço sua empresa presta e qual é a maior dificuldade com o sistema atual?`,
    whatsapp: `Olá! Tudo bem?\n\nPara empresas de serviços, a i3 oferece emissão de NFS-e integrada e recursos para organizar contratos e contas a receber.\n\nQual é o volume médio de notas fiscais emitidas por mês?`,
    presencial: `"Boa tarde! Como está o controle de cobranças e inadimplência? Quanto tempo a equipe dedica à emissão de notas no portal da prefeitura em vez de atender clientes?"`
  },
  transporte: {
    nome: 'Transportadora / Cargas',
    ativa: `GATILHO DE ATENÇÃO: Agilidade na emissão de CT-e e MDF-e para liberar cargas.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! No transporte, um veículo aguardando documentação pode atrasar a operação. Como vocês emitem CT-e e MDF-e e organizam a liberação dos romaneios dos motoristas?`,
    recebida: `POSTURA DE AUTORIDADE: Modal e documentação.\n\n"i3 Sistemas, prazer em falar com você. No setor de logística, a emissão ágil de CT-e e MDF-e ajuda a manter as cargas em movimento. Quantos veículos estão em operação na frota hoje?`,
    whatsapp: `Olá! Tudo bem?\n\nPara transporte e logística, temos recursos para emissão de CT-e e MDF-e e organização da documentação de cargas.\n\nVocês transportam cargas próprias ou prestam serviço de frete para terceiros?`,
    presencial: `"Boa tarde! Quanto tempo os motoristas aguardam pela emissão dos documentos antes de seguir viagem? Como a equipe prepara hoje o romaneio e o manifesto das cargas?"`
  },
  industria: {
    nome: 'Indústria / Outro Segmento',
    ativa: `GATILHO DE ATENÇÃO: Controle de matéria-prima e custo de produção.\n\n"Olá, tudo bem? Aqui é da i3 Sistemas! Muitas indústrias precisam acompanhar o consumo de matéria-prima e o custo real do produto fabricado. Como vocês registram a produção e atualizam o estoque de insumos e produtos acabados?`,
    recebida: `POSTURA DE AUTORIDADE: Ficha técnica e produção.\n\n"i3 Sistemas, bom dia/boa tarde! Na indústria, a ficha técnica e as regras fiscais são importantes para controlar a operação. Qual produto vocês fabricam e qual é o principal gargalo entre a produção e a expedição?`,
    whatsapp: `Olá! Tudo bem?\n\nPara indústrias, a i3 oferece recursos para organizar produção, consumo de insumos, custos e emissão fiscal.\n\nVocês produzem sob encomenda ou mantêm estoque de pronta-entrega?`,
    presencial: `"Boa tarde! Como a equipe de vendas consulta o que já está disponível para faturamento sem precisar ir até o galpão conferir com a produção?"`
  }
};

const attendanceScriptsByScreen = {
  1: {
    ligacao: 'Selecione o segmento da empresa para carregar os gatilhos de abordagem específicos.',
    whatsapp: 'Olá! Para montar a proposta ideal, qual é o segmento da sua empresa hoje?',
    presencial: 'Observe a operação e pergunte quais produtos têm maior giro. Mostre como uma tela de venda rápida pode evitar filas.'
  },
  2: {
    ligacao: 'Pergunte o regime tributário: MEI, Simples ou Normal. Explore como a importação de XML e a tributação automática podem ajudar.',
    whatsapp: 'Qual é o regime fiscal da empresa: MEI, Simples Nacional ou Lucro Presumido/Real? Essa informação ajuda a indicar a configuração certa.',
    presencial: 'Converse sobre as regras fiscais da empresa e mostre como o sistema ajuda a reduzir erros na rotina tributária.'
  },
  3: {
    ligacao: 'Descubra se a principal necessidade é emitir notas, controlar estoque ou acompanhar o financeiro. Confirme quantos usuários operarão o sistema.',
    whatsapp: 'O que mais toma tempo hoje: emitir notas, controlar estoque ou conferir o caixa? Quantas pessoas vão usar o sistema?',
    presencial: 'Entenda a rotina de cada operador e destaque o controle de acesso para ações como cancelamentos, sangrias e descontos.'
  },
  4: {
    ligacao: 'Apresente Pix e TEF para agilizar o caixa e reduzir erros de conferência. Para restaurantes, pergunte sobre comandas e pedidos.',
    whatsapp: 'Vamos avaliar os recursos compatíveis com sua operação. Pix integrado e TEF, por exemplo, podem agilizar o caixa e facilitar a conferência.',
    presencial: 'Observe os meios de pagamento e explique como a integração do TEF reduz a conferência manual das vendas.'
  },
  5: {
    ligacao: 'Apresente as opções de cardápio digital e relacione os recursos do plano escolhido à rotina do estabelecimento.',
    whatsapp: 'Escolha o plano de Cardápio Digital QR Code mais adequado. Posso ajudar a comparar os recursos de cada opção.',
    presencial: 'Mostre no celular como o cliente navega pelo cardápio digital e como fotos dos itens podem apoiar a escolha.'
  },
  6: {
    ligacao: 'Confirme os dados para preparar a proposta e combine o próximo contato ou uma demonstração do sistema.',
    whatsapp: 'Preencha seus dados para receber o resumo da proposta e os valores estimados pelo WhatsApp.',
    presencial: 'Confirme os dados do cliente, formalize o orçamento e alinhe os próximos passos da implantação.'
  },
  7: {
    ligacao: 'Apresente o valor estimado, valide os módulos e pergunte se podemos agendar uma demonstração ou instalação.',
    whatsapp: 'A proposta está pronta. Use o botão para abrir o WhatsApp e enviar o resumo ao atendimento comercial.',
    presencial: 'Revise a proposta com o cliente, relacione os recursos às necessidades levantadas e combine o próximo passo.'
  }
};
let currentAttendanceTab = 'ativa';
const attendanceTabs = [...document.querySelectorAll('[data-attendance-tab]')];
const attendanceContent = document.getElementById('attendance-content');
const attendanceStatus = document.getElementById('attendance-status');

function selectAttendanceTab(tabName) {
  if (!['ativa', 'recebida', 'whatsapp', 'presencial'].includes(tabName)) return;
  currentAttendanceTab = tabName;
  attendanceTabs.forEach(tab => {
    const selected = tab.dataset.attendanceTab === tabName;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) attendanceContent.setAttribute('aria-labelledby', tab.id);
  });
  updateAttendanceContent();
}

function updateAttendanceContent() {
  if (!attendanceContent) return;

  if (state.currentScreen === 1) {
    const segmento = segmentosScripts[state.data.segmento];
    if (!segmento) {
      if (attendanceStatus) attendanceStatus.textContent = 'Tela 1 • Selecione um segmento';
      attendanceContent.textContent = 'Selecione um segmento abaixo para carregar o roteiro de abordagem comercial.';
      return;
    }

    if (attendanceStatus) attendanceStatus.textContent = `Tela 1 • Roteiro: ${segmento.nome}`;
    attendanceContent.textContent = segmento[currentAttendanceTab];
    return;
  }

  if (attendanceStatus) attendanceStatus.textContent = `Tela ${state.currentScreen} • Condução Comercial`;
  const screenScripts = attendanceScriptsByScreen[state.currentScreen] || attendanceScriptsByScreen[1];
  const channel = currentAttendanceTab === 'ativa' || currentAttendanceTab === 'recebida'
    ? 'ligacao'
    : currentAttendanceTab;
  attendanceContent.textContent = screenScripts[channel] || 'Acompanhe as opções com o cliente para avançar a cotação.';
}

attendanceTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectAttendanceTab(tab.dataset.attendanceTab));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + attendanceTabs.length) % attendanceTabs.length;
    attendanceTabs[nextIndex].focus();
    selectAttendanceTab(attendanceTabs[nextIndex].dataset.attendanceTab);
  });
});

const modulosDetalhes = {
  m1: { titulo: 'Pix Dinâmico QR Code no PDV', imagem: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=900&q=80', oQueE: 'Gera um QR Code único para cada venda diretamente no caixa.', paraQueServe: 'Confirma o pagamento e agiliza a liberação da venda sem conferência manual de comprovantes.', quandoVale: 'Lojas e mercados com filas ou alto volume de pagamentos por Pix.', pitchVenda: 'O caixa confirma o pagamento no sistema e segue para a próxima venda com mais agilidade.' },
  m2: { titulo: 'TEF Integrado (PayGo / SiTef)', imagem: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80', oQueE: 'Integra o sistema de vendas ao terminal de pagamento.', paraQueServe: 'Envia o valor da venda ao terminal e registra o resultado no sistema.', quandoVale: 'Operações com volume relevante de pagamentos com cartão.', pitchVenda: 'A integração reduz digitação manual e facilita a conferência das vendas com cartão.' },
  m3: { titulo: 'Smart TEF POS Móvel', imagem: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=900&q=80', oQueE: 'Terminal móvel integrado ao sistema de gestão.', paraQueServe: 'Permite concluir pagamentos no salão ou próximo ao cliente.', quandoVale: 'Restaurantes, bares e lojas com atendimento fora do balcão.', pitchVenda: 'Sua equipe pode concluir a venda onde o cliente está, sem interromper o atendimento.' },
  m4: { titulo: 'Gestor Tributário (Simples)', imagem: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80', oQueE: 'Recursos para apoiar a configuração tributária de empresas do Simples Nacional.', paraQueServe: 'Ajuda a organizar regras fiscais e informações de produtos no sistema.', quandoVale: 'Varejo, mercados e distribuidoras que precisam manter cadastros fiscais consistentes.', pitchVenda: 'Uma configuração fiscal organizada dá mais previsibilidade à emissão e ao trabalho com a contabilidade.' },
  m5: { titulo: 'Gestor Tributário (Regime Normal)', imagem: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', oQueE: 'Recursos de gestão tributária para empresas no regime normal.', paraQueServe: 'Centraliza regras fiscais usadas na operação e na emissão de documentos.', quandoVale: 'Empresas no Lucro Presumido ou Real com operação fiscal mais complexa.', pitchVenda: 'Regras organizadas no sistema ajudam a manter a operação fiscal alinhada à empresa e ao contador.' },
  m6: { titulo: 'SPED Fiscal / EFD', imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', oQueE: 'Recurso para organizar e gerar informações da Escrituração Fiscal Digital.', paraQueServe: 'Reúne dados fiscais da operação para apoiar a entrega dos arquivos exigidos.', quandoVale: 'Empresas obrigadas a entregar arquivos SPED/EFD periodicamente.', pitchVenda: 'A geração integrada reduz a consolidação manual de dados no fechamento fiscal.' },
  m7: { titulo: 'Nota Fiscal de Serviço (NFS-e)', imagem: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80', oQueE: 'Emissão de notas fiscais de serviço a partir do sistema.', paraQueServe: 'Organiza a emissão de serviços junto à rotina de vendas e gestão.', quandoVale: 'Prestadores de serviço, oficinas e assistências técnicas.', pitchVenda: 'Sua equipe acompanha serviços e emissão fiscal em uma rotina mais centralizada.' },
  m8: { titulo: 'Conhecimento de Transporte (CT-e)', imagem: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80', oQueE: 'Emissão de documento fiscal para prestação de serviços de transporte.', paraQueServe: 'Registra informações da operação de transporte de cargas.', quandoVale: 'Transportadoras e distribuidores que emitem CT-e.', pitchVenda: 'A emissão integrada ajuda a manter a documentação da operação junto aos processos da empresa.' },
  m9: { titulo: 'Manifesto de Cargas (MDF-e)', imagem: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80', oQueE: 'Documento eletrônico que reúne informações dos documentos fiscais transportados.', paraQueServe: 'Organiza dados da carga, do veículo e do transporte para fiscalização.', quandoVale: 'Transportadoras e empresas que precisam emitir MDF-e.', pitchVenda: 'Centralize as informações do transporte para apoiar a preparação da documentação da carga.' },
  m10: { titulo: 'App Mobile - Vendas', imagem: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80', oQueE: 'Aplicativo móvel conectado ao sistema de gestão.', paraQueServe: 'Permite consultar produtos e registrar pedidos pelo celular ou tablet.', quandoVale: 'Vendedores de salão, equipes externas e operações com atendimento móvel.', pitchVenda: 'Sua equipe consulta informações e registra pedidos sem precisar voltar ao computador.' },
  m11: { titulo: 'Pedido VIP / Força de Vendas Externa', imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', oQueE: 'Ferramenta digital de pedidos para clientes ou vendedores externos.', paraQueServe: 'Facilita o envio de pedidos e a consulta das condições comerciais.', quandoVale: 'Atacados e indústrias com vendedores externos ou clientes recorrentes.', pitchVenda: 'Pedidos mais organizados liberam a equipe para focar no relacionamento e nas vendas.' },
  m12: { titulo: 'Dashboard Web / Indicadores na Nuvem', imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80', oQueE: 'Painel de indicadores acessível pela web.', paraQueServe: 'Apresenta dados de vendas e gestão para acompanhamento da operação.', quandoVale: 'Gestores que precisam acompanhar resultados fora da empresa.', pitchVenda: 'Consulte indicadores importantes da operação mesmo quando estiver longe da loja.' },
  m13: { titulo: 'Mesas, Comandas e Cozinha', imagem: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', oQueE: 'Gestão de mesas, comandas e envio de pedidos para a cozinha.', paraQueServe: 'Organiza os pedidos entre salão, caixa e produção.', quandoVale: 'Restaurantes, bares, pizzarias e lanchonetes.', pitchVenda: 'A equipe acompanha os pedidos em um fluxo mais claro entre o salão e a cozinha.' },
  m14: { titulo: 'Cardápio Digital QR Code', imagem: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80', oQueE: 'Cardápio digital acessado pelo cliente por QR Code.', paraQueServe: 'Apresenta produtos, imagens e opções em uma página digital.', quandoVale: 'Restaurantes que querem facilitar o acesso ao cardápio e atualizar itens com praticidade.', pitchVenda: 'O cliente acessa o cardápio no próprio celular e encontra os produtos com mais facilidade.' },
  m15: { titulo: 'Integração iFood e WhatsApp Delivery', imagem: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80', oQueE: 'Integração de canais de pedido de delivery com a operação.', paraQueServe: 'Ajuda a centralizar pedidos recebidos por canais digitais.', quandoVale: 'Restaurantes com volume de pedidos em aplicativos e WhatsApp.', pitchVenda: 'Centralizar pedidos reduz alternância entre canais durante os horários de pico.' },
  m16: { titulo: 'Ordem de Serviço (DAV-OS)', imagem: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=900&q=80', oQueE: 'Registro e acompanhamento de ordens de serviço.', paraQueServe: 'Organiza etapas, itens, mão de obra e histórico dos serviços.', quandoVale: 'Oficinas e assistências técnicas que precisam acompanhar serviços em andamento.', pitchVenda: 'Consulte o histórico do atendimento e acompanhe cada serviço em um só lugar.' },
  m17: { titulo: 'Integração com Loja Virtual', imagem: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', oQueE: 'Integração entre a loja virtual e a gestão da operação.', paraQueServe: 'Sincroniza informações como produtos e estoque entre canais.', quandoVale: 'Varejistas que vendem tanto no ponto físico quanto pela internet.', pitchVenda: 'Uma operação conectada facilita acompanhar produtos e pedidos dos diferentes canais.' },
  m18: { titulo: 'Boletos e Integração Serasa', imagem: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80', oQueE: 'Recursos de cobrança e consulta de crédito integrados à gestão.', paraQueServe: 'Apoia a emissão de boletos e a análise de informações de crédito.', quandoVale: 'Lojas e atacadistas que vendem a prazo ou trabalham com cobrança recorrente.', pitchVenda: 'Organize cobranças junto ao cadastro e ao histórico financeiro dos clientes.' },
  m19: { titulo: 'Fidelidade e Cashback', imagem: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80', oQueE: 'Programa de benefícios vinculado às compras dos clientes.', paraQueServe: 'Registra pontos ou cashback para incentivar novas compras.', quandoVale: 'Varejo, mercados e restaurantes que investem em relacionamento recorrente.', pitchVenda: 'Uma estratégia de benefícios ajuda a reconhecer clientes frequentes e estimular o retorno.' }
};

function showModuleDetails(moduleId) {
  const item = modulosDetalhes[moduleId];
  if (!item) return;

  document.getElementById('inspector-content').hidden = false;
  const image = document.getElementById('insp-img');
  image.hidden = false;
  image.alt = item.titulo;
  image.onerror = () => { image.hidden = true; };
  image.src = item.imagem;
  document.getElementById('insp-titulo').textContent = item.titulo;
  document.getElementById('insp-oque').textContent = item.oQueE;
  document.getElementById('insp-paraque').textContent = item.paraQueServe;
  document.getElementById('insp-quando').textContent = item.quandoVale;
  document.getElementById('insp-pitch').textContent = item.pitchVenda;
}

function maskWhatsApp(value = '') {
  const digits = String(value).replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const planosCardapio = [
  {
    id: 'start',
    nome: 'Start',
    valor: 39.90,
    destaque: false,
    features: [
      'Pedidos Ilimitados',
      'Itens Ilimitados',
      'Cardápio ou Catálogo em grade',
      'Fotos e imagens nos itens',
      'Adicione sua logomarca',
      'Adicione plano de fundo',
      'Página de contato',
      'Cupom de desconto',
      'Suporte por Email'
    ]
  },
  {
    id: 'premium',
    nome: 'Premium',
    valor: 79.90,
    destaque: true,
    features: [
      'Pedidos Ilimitados',
      'Itens Ilimitados',
      'Cardápio ou Catálogo em grade',
      'Fotos e imagens nos itens',
      'Adicione sua logomarca',
      'Adicione plano de fundo',
      'Página de contato',
      'Cupom de desconto',
      'WhatsApp integrado',
      'Suporte por Email'
    ]
  },
  {
    id: 'enterprise',
    nome: 'Enterprise',
    valor: 149.90,
    destaque: false,
    features: [
      'Tudo do Premium, mais:',
      'Integração via API',
      'Impressão automática (ESC/POS)',
      'Ponto de venda (PDV)'
    ]
  }
];

function getPlanoCardapio(id) {
  return planosCardapio.find(plan => plan.id === id) || null;
}

// Dados dos Módulos para facilitar filtro e cálculo
const modulosData = [
  { id: 'm1', nome: 'Pix QR Code PDV', preco: 40, cond: (s) => (s.segmento === 'supermercado' || s.segmento === 'varejo' || s.segmento === 'food') && s.necessidade !== 'fiscal' },
  { id: 'm2', nome: 'TEF PayGo-SiTef', preco: 160, cond: (s) => (s.segmento === 'supermercado' || s.segmento === 'varejo' || s.segmento === 'food') && s.necessidade !== 'fiscal' },
  { id: 'm3', nome: 'Smart TEF POS', preco: 120, cond: (s) => (s.segmento === 'varejo' || s.segmento === 'food' || s.segmento === 'supermercado') && s.necessidade !== 'fiscal' },
  { id: 'm4', nome: 'Gestor Tributário (Simples)', preco: 160, cond: (s) => s.regime === 'simples' && ['supermercado','varejo','atacado','industria'].includes(s.segmento) },
  { id: 'm5', nome: 'Gestor Tributário (Regime Normal)', preco: 240, cond: (s) => s.regime === 'normal' && ['supermercado','varejo','atacado','industria'].includes(s.segmento) },
  { id: 'm6', nome: 'SPED Fiscal / EFD', preco: 140, cond: (s) => s.regime === 'normal' || ['supermercado','atacado','industria'].includes(s.segmento) },
  { id: 'm7', nome: 'Nota Fiscal de Serviço (NFS-e)', preco: 60, cond: (s) => ['servicos','oficina'].includes(s.segmento) },
  { id: 'm8', nome: 'Conhecimento de Transporte (CT-e)', preco: 60, cond: (s) => ['transporte','atacado'].includes(s.segmento) },
  { id: 'm9', nome: 'Manifesto de Cargas (MDF-e)', preco: 0, consulta: true, cond: (s) => ['transporte','atacado'].includes(s.segmento) },
  { id: 'm10', nome: 'App Mobile - Master Foods / Vendas', preco: 15, cond: (s) => ['food','varejo'].includes(s.segmento) },
  { id: 'm11', nome: 'Pedido VIP / Força de Vendas Externa', preco: 0, consulta: true, cond: (s) => ['atacado','industria'].includes(s.segmento) },
  { id: 'm12', nome: 'Dashboard Web / Indicadores na Nuvem', preco: 60, cond: (s) => ['vendas_fin','completa'].includes(s.necessidade) },
  { id: 'm13', nome: 'Mesas, Comandas e Cozinha - Master Foods', preco: 0, consulta: true, cond: (s) => s.segmento === 'food' },
  { id: 'm14', nome: 'Cardápio Digital QR Code', preco: 0, consulta: true, cond: (s) => s.segmento === 'food' },
  { id: 'm15', nome: 'Integração iFood & WhatsApp Delivery - Anota AI', preco: 0, consulta: true, cond: (s) => s.segmento === 'food' },
  { id: 'm16', nome: 'Ordem de Serviço - DAV-OS', preco: 0, consulta: true, cond: (s) => s.segmento === 'oficina' },
  { id: 'm17', nome: 'Integração com Loja Virtual / E-commerce', preco: 0, consulta: true, cond: (s) => ['varejo','atacado','supermercado'].includes(s.segmento) },
  { id: 'm18', nome: 'Emissão de Boletos e Integração Serasa', preco: 0, consulta: true, cond: (s) => ['atacado','varejo'].includes(s.segmento) },
  { id: 'm19', nome: 'Sistema de Fidelidade e Cashback', preco: 0, consulta: true, cond: (s) => ['supermercado','varejo','food'].includes(s.segmento) }
];

function renderProgress(stepIndex, totalSteps = 6) {
  let dots = '';
  for (let i = 1; i <= totalSteps; i++) {
    let statusClass = i < stepIndex ? 'completed' : (i === stepIndex ? 'active' : '');
    dots += `<div class="step-dot ${statusClass}"></div>`;
  }
  return `<div class="step-indicator">${dots}</div>`;
}

function render() {
  let content = '';
  
  switch (state.currentScreen) {
    case 1:
      content = `
        <div class="screen">
          ${renderProgress(1)}
          <h2>Qual é o ramo da sua empresa?</h2>
          <p>Selecione o seu segmento para ajustarmos os recursos ideais à sua rotina.</p>
          
          <div class="options-grid">
            ${[
              { id: 'varejo', label: 'Loja / Varejo' },
              { id: 'supermercado', label: 'Supermercado / Mercado / Mercearia' },
              { id: 'atacado', label: 'Distribuidora / Atacado' },
              { id: 'food', label: 'Restaurante / Bar / Pizzaria / Lanchonete' },
              { id: 'oficina', label: 'Oficina / Assistência Técnica' },
              { id: 'servicos', label: 'Prestador de Serviços' },
              { id: 'transporte', label: 'Transportadora / Transporte de Cargas' },
              { id: 'industria', label: 'Indústria / Outro Segmento' }
            ].map(opt => `
              <label class="option-card ${state.data.segmento === opt.id ? 'selected' : ''}">
                <input type="radio" name="segmento" value="${opt.id}" ${state.data.segmento === opt.id ? 'checked' : ''} onchange="updateState('segmento', this.value); render()">
                <div class="check-indicator"></div>
                <div class="option-content">
                  <span class="option-title">${opt.label}</span>
                </div>
              </label>
            `).join('')}
          </div>
          <div class="nav-buttons">
            <button class="btn-primary" onclick="nextScreen()" ${!state.data.segmento ? 'disabled' : ''}>Avançar</button>
          </div>
        </div>
      `;
      break;

    case 2:
      content = `
        <div class="screen">
          ${renderProgress(2)}
          <h2>Qual é o regime tributário da empresa?</h2>
          <p>O enquadramento fiscal determina a licença base de gestão e as regras de tributação.</p>
          
          <div class="options-grid">
            ${[
              { id: 'mei', label: 'MEI (Microempreendedor Individual)' },
              { id: 'simples', label: 'Simples Nacional' },
              { id: 'normal', label: 'Lucro Presumido ou Lucro Real (Regime Normal)' },
              { id: 'nsei', label: 'Ainda não sei / Quero apenas emissão fiscal simples' }
            ].map(opt => `
              <label class="option-card ${state.data.regime === opt.id ? 'selected' : ''}">
                <input type="radio" name="regime" value="${opt.id}" ${state.data.regime === opt.id ? 'checked' : ''} onchange="updateState('regime', this.value); nextScreen()">
                <div class="check-indicator"></div>
                <div class="option-content">
                  <span class="option-title">${opt.label}</span>
                </div>
              </label>
            `).join('')}
          </div>
          
          <div class="nav-buttons">
            <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
          </div>
        </div>
      `;
      break;

    case 3:
      content = `
        <div class="screen">
          ${renderProgress(3)}
          <h2>O que precisa de controlar e quantas pessoas vão utilizar?</h2>
          <p>Vamos dimensionar os pontos de acesso e o nível de profundidade da gestão.</p>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label class="form-label">Necessidade Principal</label>
            <div class="options-grid">
              ${[
                { id: 'fiscal', label: 'Apenas emissão fiscal básica (NF-e ou NFC-e)' },
                { id: 'vendas_estoque', label: 'Vendas + Controlo de Estoque' },
                { id: 'vendas_fin', label: 'Vendas + Estoque + Financeiro' },
                { id: 'pdv', label: 'Frente de Caixa (PDV) / Balcão com estoque' },
                { id: 'completa', label: 'Gestão Completa (Compras, Estoque, Financeiro, Fiscal e Vendas)' }
              ].map(opt => `
                <label class="option-card ${state.data.necessidade === opt.id ? 'selected' : ''}">
                  <input type="radio" name="necessidade" value="${opt.id}" ${state.data.necessidade === opt.id ? 'checked' : ''} onchange="updateState('necessidade', this.value); render()">
                  <div class="check-indicator"></div>
                  <div class="option-content">
                    <span class="option-title">${opt.label}</span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Quantidade de Usuários / Pontos de Uso</label>
            <p class="muted" style="font-size: var(--fs-xs); margin-bottom: 8px;">Considere caixas, gerência, financeiro e retaguarda. Todos os planos incluem 1 usuário base.</p>
            <div style="display:flex; align-items:center; gap: 16px;">
              <input type="range" min="1" max="50" value="${state.data.usuarios}" oninput="updateState('usuarios', this.value); document.getElementById('user-val').innerText = this.value" style="flex:1;">
              <div style="font-weight: 800; font-size: 1.5rem; color: var(--lime); width: 40px; text-align:right;" id="user-val">${state.data.usuarios}</div>
            </div>
          </div>
          
          <div class="nav-buttons">
            <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
            <button class="btn-primary" onclick="goToModulos()" ${!state.data.necessidade ? 'disabled' : ''}>Avançar</button>
          </div>
        </div>
      `;
      break;

    case 4:
      const modulosElegiveis = modulosData.filter(m => m.cond(state.data));
      
      content = `
        <div class="screen">
          ${renderProgress(4)}
          <h2>Selecione os recursos e rotinas necessárias para a sua operação:</h2>
          <p>Exibindo apenas módulos compatíveis com o perfil diagnosticado.</p>
          
          <div class="form-group">
            <div class="options-grid">
              ${modulosElegiveis.length > 0 ? modulosElegiveis.map(mod => `
                <label class="option-card ${state.data.modulos[mod.id] ? 'selected' : ''}" onmouseenter="showModuleDetails('${mod.id}')" onclick="showModuleDetails('${mod.id}')">
                  <input type="checkbox" ${state.data.modulos[mod.id] ? 'checked' : ''} onfocus="showModuleDetails('${mod.id}')" onchange="updateModulo('${mod.id}', this.checked); render()">
                  <div class="check-indicator"></div>
                  <div class="option-content">
                    <span class="option-title">${mod.nome}</span>
                    <span class="option-desc">${mod.consulta ? 'Sob consulta' : '+ R$ ' + mod.preco + ',00/mês'}${mod.id === 'm10' ? ' por licença' : ''}</span>
                  </div>
                </label>
              `).join('') : `
                <div class="glass-card text-center" style="margin-top:20px;">
                  <span style="font-size:2rem;">✨</span>
                  <p style="margin-top:10px;">O seu perfil (Apenas emissão fiscal básica) inclui o plano Start Lite, que dispensa módulos adicionais complexos!</p>
                </div>
              `}
            </div>
          </div>
          
          <div class="nav-buttons">
            <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
            <button class="btn-primary" onclick="nextScreen()">Avançar</button>
          </div>
        </div>
      `;
      break;

    case 5:
      if (state.data.modulos.m14) {
        content = `
          <div class="screen">
            ${renderProgress(5, 7)}
            <h2>Escolha o plano do Cardápio Digital QR Code</h2>
            <p>Selecione a opção ideal para o seu restaurante ou negócio.</p>

            <div class="options-grid">
              ${planosCardapio.map(plan => `
                <label class="option-card ${state.data.cardapioPlano === plan.id ? 'selected' : ''}">
                  <input type="radio" name="cardapioPlano" value="${plan.id}" ${state.data.cardapioPlano === plan.id ? 'checked' : ''} onchange="updateState('cardapioPlano', this.value); render()">
                  <div class="check-indicator"></div>
                  <div class="option-content">
                    <span class="option-title">${plan.destaque ? '⭐ ' : ''}${plan.nome}</span>
                    <span class="option-desc">R$ ${plan.valor.toFixed(2).replace('.', ',')}/Plano Mensal</span>
                    ${plan.destaque ? '<div style="margin-top:8px; font-size:0.7rem; font-weight:800; color: var(--lime);">Mais popular</div>' : ''}
                    <div style="margin-top: 10px; font-size: 0.72rem; color: var(--on-dark-muted); line-height: 1.6;">
                      ${plan.features.map(feature => `<div>• ${feature}</div>`).join('')}
                    </div>
                  </div>
                </label>
              `).join('')}
            </div>

            <div class="nav-buttons">
              <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
              <button class="btn-primary" onclick="nextScreen()" ${!state.data.cardapioPlano ? 'disabled' : ''}>Continuar</button>
            </div>
          </div>
        `;
      } else {
        content = `
          <div class="screen">
            ${renderProgress(6, 7)}
            <h2>A sua cotação personalizada está pronta!</h2>
            <p>Informe os seus dados para enviarmos a proposta oficial e detalhada diretamente para o seu WhatsApp.</p>
            
            <div class="form-group">
              <label class="form-label">Nome Completo</label>
              <input type="text" placeholder="Seu nome" value="${state.data.lead.nome}" onchange="updateLead('nome', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">Nome da Empresa</label>
              <input type="text" placeholder="Razão social ou Fantasia" value="${state.data.lead.empresa}" onchange="updateLead('empresa', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">WhatsApp com DDD</label>
              <input type="tel" placeholder="(00) 00000-0000" value="${state.data.lead.whatsapp}" oninput="this.value = maskWhatsApp(this.value); updateLead('whatsapp', this.value)">
            </div>
            <div class="form-group">
              <label class="form-label">E-mail</label>
              <input type="email" placeholder="seu@email.com.br" value="${state.data.lead.email}" onchange="updateLead('email', this.value)">
            </div>
            
            <div class="nav-buttons">
              <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
              <button class="btn-primary" onclick="calcularERedirecionar()" id="btn-finalizar">Enviar Cotação Para WhatsApp</button>
            </div>
          </div>
        `;
      }
      break;

    case 6:
      content = `
        <div class="screen">
          ${renderProgress(6, 7)}
          <h2>A sua cotação personalizada está pronta!</h2>
          <p>Informe os seus dados para enviarmos a proposta oficial e detalhada diretamente para o seu WhatsApp.</p>
          
          <div class="form-group">
            <label class="form-label">Nome Completo</label>
            <input type="text" placeholder="Seu nome" value="${state.data.lead.nome}" onchange="updateLead('nome', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Nome da Empresa</label>
            <input type="text" placeholder="Razão social ou Fantasia" value="${state.data.lead.empresa}" onchange="updateLead('empresa', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp com DDD</label>
            <input type="tel" placeholder="(00) 00000-0000" value="${state.data.lead.whatsapp}" oninput="this.value = maskWhatsApp(this.value); updateLead('whatsapp', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">E-mail</label>
            <input type="email" placeholder="seu@email.com.br" value="${state.data.lead.email}" onchange="updateLead('email', this.value)">
          </div>
          
          <div class="nav-buttons">
            <button class="btn-secondary" onclick="prevScreen()">Voltar</button>
            <button class="btn-primary" onclick="calcularERedirecionar()" id="btn-finalizar">Enviar Cotação Para WhatsApp</button>
          </div>
        </div>
      `;
      break;

    case 7:
      content = `
        <div class="screen">
          ${renderProgress(7, 7)}
          <div style="background: var(--c-green); color: white; padding: 12px; border-radius: var(--r-md); font-size: var(--fs-sm); font-weight: 700; text-align: center; margin-bottom: 20px;">
            Cotação calculada com sucesso! Compartilhe a proposta ou agende uma reunião.
          </div>
          
          <div class="glass-card" style="margin-bottom: 16px;">
            <div class="muted" style="font-weight:700; font-size: 0.75rem; margin-bottom: 8px;">PERFIL DIAGNOSTICADO</div>
            <div style="font-size: var(--fs-sm); font-weight: 600;">
              ${state.data.segmento.toUpperCase()} | ${state.data.regime.toUpperCase()} | ${state.data.usuarios} Usuário(s)
            </div>
          </div>

          <div class="glass-card" style="margin-bottom: 16px;">
            <div class="muted" style="font-weight:700; font-size: 0.75rem; margin-bottom: 8px;">SOLUÇÃO INDICADA</div>
            <div style="font-size: var(--fs-md); font-weight: 800; color: var(--lime); margin-bottom: 4px;">
              Plano ${state.resultado.nomePlano}
            </div>
            ${state.data.cardapioPlano ? `
              <div style="font-size: var(--fs-xs); color: var(--on-dark-muted); margin-top: 8px;">
                <strong>Cardápio Digital QR Code:</strong> ${getPlanoCardapio(state.data.cardapioPlano)?.nome || state.data.cardapioPlano} (${(getPlanoCardapio(state.data.cardapioPlano)?.valor || 0).toFixed(2).replace('.', ',')} / mês)
              </div>
            ` : ''}
            ${state.resultado.modulosNomes.length > 0 ? `
              <div style="font-size: var(--fs-xs); color: var(--on-dark-muted); margin-top: 8px;">
                <strong>Módulos Adicionais:</strong><br>
                ${state.resultado.modulosNomes.join('<br>')}
              </div>
            ` : ''}
          </div>
          
          <div class="glass-card">
            <div class="muted" style="font-weight:700; font-size: 0.75rem; margin-bottom: 12px;">DISCRIMINAÇÃO FINANCEIRA MENSAL</div>
            
            <div class="breakdown-row">
              <span class="muted">Subtotal Plano Base</span>
              <span>R$ ${state.resultado.valorPlano.toFixed(2).replace('.',',')}</span>
            </div>
            <div class="breakdown-row">
              <span class="muted">Subtotal Usuários Extras</span>
              <span>R$ ${state.resultado.valorExtras.toFixed(2).replace('.',',')}</span>
            </div>
            <div class="breakdown-row">
              <span class="muted">Subtotal Módulos</span>
              <span>R$ ${state.resultado.valorModulos.toFixed(2).replace('.',',')}</span>
            </div>
            
            <div class="breakdown-row total">
              <span>Mensalidade Estimada</span>
              <span>R$ ${state.resultado.totalCalculado.toFixed(2).replace('.',',')} / mês</span>
            </div>
            
            ${state.resultado.modulosConsulta.length > 0 ? `
              <div style="margin-top: 12px; font-size: 0.7rem; color: var(--c-orange);">
                * Há módulos selecionados com valores sob consulta técnica.
              </div>
            ` : ''}
          </div>

          <div class="summary-actions">
            <button class="btn-primary" onclick="openWhatsApp()">Compartilhar Cotação pelo WhatsApp</button>
            <button class="btn-secondary" onclick="sendQuoteByEmail()">Enviar por E-mail</button>
            <button class="btn-secondary" onclick="scheduleMeeting()">Agendar Reunião</button>
          </div>
          <div class="nav-buttons" style="flex-direction: column;">
            <button class="btn-secondary" style="border:none; background:transparent;" onclick="resetApp()">Refazer Cotação</button>
          </div>
        </div>
      `;
      break;
  }

  appContainer.innerHTML = content;
  updateAttendanceContent();
}

// Helpers
function updateState(field, value) {
  state.data[field] = value;
}
function updateModulo(id, checked) {
  state.data.modulos[id] = checked;
  if (id === 'm14' && !checked) {
    state.data.cardapioPlano = '';
  }
}
function updateLead(field, value) {
  state.data.lead[field] = value;
}
function nextScreen() {
  if (state.currentScreen === 4) {
    state.currentScreen = state.data.modulos.m14 ? 5 : 6;
  } else if (state.currentScreen === 5 && state.data.modulos.m14) {
    state.currentScreen = 6;
  } else {
    state.currentScreen++;
  }
  render();
}
function prevScreen() {
  if (state.currentScreen === 6 && state.data.modulos.m14) {
    state.currentScreen = 5;
  } else if (state.currentScreen === 6 && !state.data.modulos.m14) {
    state.currentScreen = 4;
  } else if (state.currentScreen === 5 && state.data.modulos.m14) {
    state.currentScreen = 4;
  } else {
    state.currentScreen--;
    if (state.currentScreen === 4 && state.data.necessidade === 'fiscal') {
      state.currentScreen--; // Pula a tela 4 se for fiscal
    }
  }
  render();
}
function goToModulos() {
  if (state.data.necessidade === 'fiscal') {
    state.currentScreen = 6; // Pula os módulos diretos para Captação
  } else {
    state.currentScreen = 4;
  }
  render();
}
function resetApp() {
  state.currentScreen = 1;
  state.data = { segmento: '', regime: '', necessidade: '', usuarios: 1, modulos: {}, cardapioPlano: '', lead: { nome: '', empresa: '', whatsapp: '', email: '' } };
  render();
}

// Cálculo e WhatsApp
function calcularERedirecionar() {
  const s = state.data;
  
  // Validar Lead
  if(!s.lead.nome || !s.lead.whatsapp) {
    alert("Por favor, preencha seu nome e WhatsApp para receber a cotação.");
    return;
  }

  // 1. Calcular Plano Base
  let nomePlano = 'Essencial Simples';
  let valorPlano = 250;

  if (s.necessidade === 'fiscal') {
    nomePlano = 'Start Lite (iComércio Lite)';
    valorPlano = 180;
  } else if (s.segmento === 'supermercado' && s.necessidade === 'pdv') {
    nomePlano = 'Gestão Plus (iComércio Gestão + PDV)';
    valorPlano = 300;
  } else if (s.regime === 'mei') {
    nomePlano = 'Start MEI (iComércio Gestão)';
    valorPlano = 200;
  } else if (s.regime === 'simples') {
    nomePlano = 'Essencial Simples (iComércio Gestão)';
    valorPlano = 250;
  } else if (s.regime === 'normal') {
    nomePlano = 'Avançado Regime Normal (iComércio Gestão)';
    valorPlano = 280;
  }

  // 2. Calcular Usuários Extras
  let usuariosCount = parseInt(s.usuarios) || 1;
  let extras = usuariosCount > 1 ? usuariosCount - 1 : 0;
  let valorExtras = 0;
  
  if (extras >= 1 && extras <= 4) valorExtras = extras * 25;
  else if (extras >= 5 && extras <= 10) valorExtras = extras * 20;
  else if (extras >= 11) valorExtras = extras * 15;

  // 3. Calcular Módulos
  let valorModulos = 0;
  let modulosNomes = [];
  let modulosValoresFormatados = [];
  let modulosConsulta = [];

  modulosData.forEach(m => {
    if (m.id === 'm14') return;
    if (s.modulos[m.id]) {
      modulosNomes.push(m.nome);
      if (m.consulta) {
        modulosConsulta.push(m.nome);
        modulosValoresFormatados.push(`${m.nome} (Sob consulta)`);
      } else {
        let p = m.preco;
        if (m.id === 'm10') p = p * usuariosCount; // App mobile = por licença, vamos assumir 1 por usuário neste wizard simples
        valorModulos += p;
        modulosValoresFormatados.push(`${m.nome} (R$ ${p.toFixed(2)})`);
      }
    }
  });

  const planoCardapio = s.modulos.m14 ? getPlanoCardapio(s.cardapioPlano) : null;
  if (planoCardapio) {
    modulosNomes.push(`Cardápio Digital QR Code - ${planoCardapio.nome}`);
    modulosConsulta.push(`Cardápio Digital QR Code - ${planoCardapio.nome}`);
    modulosValoresFormatados.push(`Cardápio Digital QR Code (${planoCardapio.nome} - R$ ${planoCardapio.valor.toFixed(2)})`);
    valorModulos += planoCardapio.valor;
  }

  const totalCalculado = valorPlano + valorExtras + valorModulos;

  state.resultado = {
    nomePlano, valorPlano, extras, valorExtras,
    modulosNomes, modulosValoresFormatados, modulosConsulta,
    valorModulos, totalCalculado,
    planoCardapio
  };

  state.currentScreen = 7;
  render();
}

function buildQuoteMessage() {
  const l = state.data.lead;
  const s = state.data;
  const r = state.resultado;

  const getLabel = (arr, val) => arr.find(x => x.id === val)?.label || val;
  const segLabel = getLabel([
    { id: 'varejo', label: 'Loja / Varejo' },
    { id: 'supermercado', label: 'Supermercado / Mercado / Mercearia' },
    { id: 'atacado', label: 'Distribuidora / Atacado' },
    { id: 'food', label: 'Restaurante / Bar / Pizzaria' },
    { id: 'oficina', label: 'Oficina / Assistência' },
    { id: 'servicos', label: 'Prestador de Serviços' },
    { id: 'transporte', label: 'Transportadora' },
    { id: 'industria', label: 'Indústria' }
  ], s.segmento);
  
  const regLabel = getLabel([
    { id: 'mei', label: 'MEI' },
    { id: 'simples', label: 'Simples Nacional' },
    { id: 'normal', label: 'Lucro Presumido ou Real' },
    { id: 'nsei', label: 'Não sei' }
  ], s.regime);

  let texto = `Olá, equipe i3 Sistemas!
Acabei de efetuar a simulação na calculadora do vosso site e solicito a minha cotação oficial:

🏢 DADOS DA EMPRESA:
• Empresa: ${l.empresa}
• Responsável: ${l.nome}
• Segmento: ${segLabel}
• Regime Tributário: ${regLabel}
• Usuários: ${s.usuarios} utilizador(es) (${r.extras} extra(s))

📦 PROPOSTA DIAGNOSTICADA:
• Plano Base: ${r.nomePlano} (R$ ${r.valorPlano.toFixed(2)})
• Usuários Extras: ${r.extras} un. (R$ ${r.valorExtras.toFixed(2)})
${r.planoCardapio ? `• Plano Cardápio Digital QR Code: ${r.planoCardapio.nome} (R$ ${r.planoCardapio.valor.toFixed(2)})` : ''}
• Módulos Selecionados:
${r.modulosValoresFormatados.length > 0 ? r.modulosValoresFormatados.map(m => `  - ${m}`).join('\n') : '  - Nenhum adicional'}
${r.modulosConsulta.length > 0 ? `  (Módulos sob consulta técnica: ${r.modulosConsulta.join(', ')})` : ''}

💰 TOTAL ESTIMADO: R$ ${r.totalCalculado.toFixed(2)}/mês

Aguardo o envio da proposta formal e o agendamento de uma demonstração!`;

  return texto;
}

function formatMeetingCurrency(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

function buildMeetingMessage(date, time) {
  const lead = state.data.lead;
  const result = state.resultado;
  const firstName = lead.nome.trim().split(/\s+/)[0] || 'tudo bem';
  const segmentLabels = {
    varejo: 'Loja / Varejo',
    supermercado: 'Supermercado / Mercado / Mercearia',
    atacado: 'Distribuidora / Atacado',
    food: 'Restaurante / Bar / Pizzaria / Lanchonete',
    oficina: 'Oficina / Assistência',
    servicos: 'Prestador de Serviços',
    transporte: 'Transportadora',
    industria: 'Indústria'
  };
  const regimeLabels = {
    mei: 'MEI',
    simples: 'Simples Nacional',
    normal: 'Lucro Presumido ou Real',
    nsei: 'Ainda não informado'
  };
  const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const [hour, minute] = time.split(':');
  const timeLabel = `${Number(hour)}h${minute}`;
  const planName = result.nomePlano.replace(/\s*\(([^)]+)\)$/, ' — $1');
  const moduleLines = modulosData
    .filter(module => module.id !== 'm14' && state.data.modulos[module.id])
    .map(module => {
      if (module.consulta) return `• ${module.nome}: sob consulta`;
      const licenses = module.id === 'm10' ? Number(state.data.usuarios) || 1 : 1;
      return `• ${module.nome}: ${formatMeetingCurrency(module.preco * licenses)}/mês`;
    });

  if (result.planoCardapio) {
    moduleLines.push(`• Cardápio Digital QR Code — ${result.planoCardapio.nome}: ${formatMeetingCurrency(result.planoCardapio.valor)}/mês`);
  }

  return `Olá, ${firstName}! Tudo certo? 😊

Consegui encaixar sua demonstração na agenda de um dos nossos especialistas! Seguem os detalhes:

📅 **Data:** ${dateLabel}
🕓 **Horário:** ${timeLabel}

🏢 **DADOS DA SUA EMPRESA**
• Empresa: ${lead.empresa || 'Não informada'}
• Segmento: ${segmentLabels[state.data.segmento] || state.data.segmento}
• Regime tributário: ${regimeLabels[state.data.regime] || state.data.regime}
• Usuários: ${state.data.usuarios}

📦 **SOLUÇÃO INDICADA**
• Plano ${planName}: ${formatMeetingCurrency(result.valorPlano)}/mês
${moduleLines.length ? moduleLines.join('\n') : '• Sem módulos adicionais'}

💰 **Investimento mensal estimado: ${formatMeetingCurrency(result.totalCalculado)}**

Na demonstração, nosso especialista vai apresentar o sistema e mostrar como ele pode ajudar na gestão do seu negócio.

📞 Antes da visita, vou te ligar para confirmar tudo certinho.

Obrigado pela oportunidade, ${firstName}! Até lá! 🤝`;
}

function openWhatsApp() {
  const numero = "5511999999999"; // Substituir pelo número real
  const message = buildQuoteMessage();
  activeShare = {
    mode: 'whatsapp',
    fields: [{ label: 'Mensagem para o WhatsApp', value: message, multiline: true }],
    copyAll: message,
    targetUrl: `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(message)}`
  };
  showShareDialog();
}

function sendQuoteByEmail() {
  const lead = state.data.lead;
  if (!lead.email.trim()) {
    alert('Informe o e-mail na etapa anterior para preparar o envio da cotação.');
    return;
  }

  const subject = `Cotação comercial i3 Sistemas - ${lead.empresa || lead.nome}`;
  const message = buildQuoteMessage();
  const recipient = lead.email.trim();
  activeShare = {
    mode: 'email',
    fields: [
      { label: 'E-mail do cliente', value: recipient },
      { label: 'Assunto', value: subject },
      { label: 'Texto do e-mail', value: message, multiline: true }
    ],
    copyAll: `E-mail do cliente:\n${recipient}\n\nAssunto:\n${subject}\n\nTexto do e-mail:\n${message}`,
    targetUrl: `mailto:${encodeURIComponent(recipient).replace(/%40/gi, '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  };
  showShareDialog();
}

function scheduleMeeting() {
  activeShare = {
    mode: 'meeting',
    fields: [
      { label: 'Data da reunião', value: '', inputType: 'date' },
      { label: 'Horário da reunião', value: '', inputType: 'time' },
      { label: 'Convite e detalhes da cotação', value: '', multiline: true }
    ],
    copyAll: ''
  };
  showShareDialog();
}

function updateMeetingDraft() {
  if (!activeShare || activeShare.mode !== 'meeting') return;

  const [dateField, timeField, messageField] = activeShare.fields;
  const message = dateField.value && timeField.value
    ? buildMeetingMessage(dateField.value, timeField.value)
    : 'Selecione a data e o horário da reunião para gerar o convite com os detalhes da cotação.';
  messageField.value = message;
  activeShare.copyAll = dateField.value && timeField.value ? message : '';

  const messageInput = shareDialogFields.querySelector(`#share-field-${activeShare.fields.indexOf(messageField)}`);
  if (messageInput) messageInput.value = message;

  const canCopy = Boolean(dateField.value && timeField.value);
  shareCopyAllButton.disabled = !canCopy;
  if (messageField.copyButton) messageField.copyButton.disabled = !canCopy;
  shareDialogStatus.textContent = canCopy ? '' : 'Selecione a data e o horário para copiar o convite.';
}

function showShareDialog() {
  const isMeeting = activeShare.mode === 'meeting';
  shareDialogTitle.textContent = activeShare.mode === 'email'
    ? 'Enviar cotação por e-mail'
    : isMeeting ? 'Agendar reunião' : 'Compartilhar cotação pelo WhatsApp';
  shareDialog.querySelector('.share-dialog-eyebrow').textContent = isMeeting
    ? 'Reunião comercial'
    : 'Compartilhamento';
  shareCopyAllButton.textContent = isMeeting ? 'Copiar convite e cotação' : 'Copiar tudo';
  shareCopyAllButton.disabled = isMeeting;
  shareOpenTargetButton.textContent = activeShare.mode === 'email'
    ? 'Abrir aplicativo de e-mail'
    : 'Abrir WhatsApp';
  shareOpenTargetButton.hidden = isMeeting;
  shareDialogStatus.textContent = '';
  shareDialogFields.replaceChildren();

  activeShare.fields.forEach((field, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'share-field';

    const label = document.createElement('label');
    const fieldId = `share-field-${index}`;
    label.className = 'share-field-label';
    label.htmlFor = fieldId;
    label.textContent = field.label;

    const value = document.createElement(field.multiline ? 'textarea' : 'input');
    value.id = fieldId;
    value.className = 'share-field-value';
    if (field.inputType) {
      value.type = field.inputType;
      value.required = true;
      value.addEventListener('input', () => {
        field.value = value.value;
        updateMeetingDraft();
      });
    } else {
      value.readOnly = true;
    }
    value.value = field.value;
    if (field.multiline) value.rows = field.label === 'Texto do e-mail' ? 9 : 12;

    const copyButton = document.createElement('button');
    copyButton.className = 'share-copy-field';
    copyButton.type = 'button';
    copyButton.textContent = 'Copiar';
    copyButton.setAttribute('aria-label', `Copiar ${field.label}`);
    copyButton.addEventListener('click', () => copyShareText(field.value, field.label));
    field.copyButton = copyButton;

    wrapper.append(label, value, copyButton);
    shareDialogFields.append(wrapper);
  });

  if (isMeeting) updateMeetingDraft();
  shareDialog.showModal();
}

async function copyShareText(text, label) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      copyShareTextFallback(text);
    }
    shareDialogStatus.textContent = `${label} copiado.`;
  } catch {
    try {
      copyShareTextFallback(text);
      shareDialogStatus.textContent = `${label} copiado.`;
    } catch {
      shareDialogStatus.textContent = 'Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.';
    }
  }
}

function copyShareTextFallback(text) {
  const temporaryField = document.createElement('textarea');
  temporaryField.value = text;
  temporaryField.setAttribute('readonly', '');
  temporaryField.style.position = 'fixed';
  temporaryField.style.opacity = '0';
  document.body.append(temporaryField);
  temporaryField.select();
  const copied = document.execCommand('copy');
  temporaryField.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

shareCopyAllButton.addEventListener('click', () => {
  if (!activeShare || (activeShare.mode === 'meeting' && !activeShare.copyAll)) return;
  copyShareText(activeShare.copyAll, 'Conteúdo');
});

shareOpenTargetButton.addEventListener('click', () => {
  if (activeShare.mode === 'email') {
    window.location.href = activeShare.targetUrl;
  } else {
    window.open(activeShare.targetUrl, '_blank', 'noopener,noreferrer');
  }
  shareDialog.close();
});

document.getElementById('share-dialog-close').addEventListener('click', () => shareDialog.close());
shareDialog.addEventListener('click', event => {
  if (event.target === shareDialog) shareDialog.close();
});

shareDialog.addEventListener('close', () => {
  shareDialogStatus.textContent = '';
  shareDialogFields.replaceChildren();
  activeShare = null;
});

shareDialog.addEventListener('cancel', () => {
  activeShare = null;
  shareDialogStatus.textContent = '';
  shareDialogFields.replaceChildren();
});

// Inicializa a App
render();
