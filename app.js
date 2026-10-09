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
const attendanceScriptsByScreen = {
  1: {
    ligacao: 'Pergunte o segmento com entusiasmo. Explique que o sistema i3 é modular e não força o cliente a pagar por recursos que não usa.',
    online: 'Olá! Para montar a proposta ideal, qual é o segmento da sua empresa hoje? Loja, mercado, restaurante, oficina ou serviço?',
    presencial: 'Observe a operação e pergunte quais produtos têm maior giro. Mostre como uma tela de venda rápida pode evitar filas.'
  },
  2: {
    ligacao: 'Pergunte o regime tributário: MEI, Simples ou Normal. Explore como a importação de XML e a tributação automática podem ajudar.',
    online: 'Qual é o regime fiscal da empresa: MEI, Simples Nacional ou Lucro Presumido/Real? Essa informação ajuda a indicar a configuração certa.',
    presencial: 'Converse sobre as regras fiscais da empresa e mostre como o sistema ajuda a reduzir erros na rotina tributária.'
  },
  3: {
    ligacao: 'Descubra se a principal necessidade é emitir notas, controlar estoque ou acompanhar o financeiro. Confirme quantos usuários operarão o sistema.',
    online: 'O que mais toma tempo hoje: emitir notas, controlar estoque ou conferir o caixa? Quantas pessoas vão usar o sistema?',
    presencial: 'Entenda a rotina de cada operador e destaque o controle de acesso para ações como cancelamentos, sangrias e descontos.'
  },
  4: {
    ligacao: 'Apresente Pix e TEF para agilizar o caixa e reduzir erros de conferência. Para restaurantes, pergunte sobre comandas e pedidos.',
    online: 'Vamos avaliar os recursos compatíveis com sua operação. Pix integrado e TEF, por exemplo, podem agilizar o caixa e facilitar a conferência.',
    presencial: 'Observe os meios de pagamento e explique como a integração do TEF reduz a conferência manual das vendas.'
  },
  5: {
    ligacao: 'Apresente as opções de cardápio digital e relacione os recursos do plano escolhido à rotina do estabelecimento.',
    online: 'Escolha o plano de Cardápio Digital QR Code mais adequado. Posso ajudar a comparar os recursos de cada opção.',
    presencial: 'Mostre no celular como o cliente navega pelo cardápio digital e como fotos dos itens podem apoiar a escolha.'
  },
  6: {
    ligacao: 'Confirme os dados para preparar a proposta e combine o próximo contato ou uma demonstração do sistema.',
    online: 'Preencha seus dados para receber o resumo da proposta e os valores estimados pelo WhatsApp.',
    presencial: 'Confirme os dados do cliente, formalize o orçamento e alinhe os próximos passos da implantação.'
  },
  7: {
    ligacao: 'Apresente o valor estimado, valide os módulos e pergunte se podemos agendar uma demonstração ou instalação.',
    online: 'A proposta está pronta. Use o botão para abrir o WhatsApp e enviar o resumo ao atendimento comercial.',
    presencial: 'Revise a proposta com o cliente, relacione os recursos às necessidades levantadas e combine o próximo passo.'
  }
};
let currentAttendanceTab = 'ligacao';
const attendanceTabs = [...document.querySelectorAll('[data-attendance-tab]')];
const attendanceContent = document.getElementById('attendance-content');

function selectAttendanceTab(tabName) {
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
  const screenScripts = attendanceScriptsByScreen[state.currentScreen] || attendanceScriptsByScreen[1];
  attendanceContent.textContent = screenScripts[currentAttendanceTab];
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

  document.getElementById('inspector-placeholder').hidden = true;
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
                <input type="radio" name="segmento" value="${opt.id}" ${state.data.segmento === opt.id ? 'checked' : ''} onchange="updateState('segmento', this.value); nextScreen()">
                <div class="check-indicator"></div>
                <div class="option-content">
                  <span class="option-title">${opt.label}</span>
                </div>
              </label>
            `).join('')}
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
            Cotação calculada com sucesso! A abrir a sua conversa no WhatsApp...
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

          <div class="nav-buttons" style="flex-direction: column;">
            <button class="btn-primary" onclick="openWhatsApp()">Compartilhar Cotação pelo WhatsApp</button>
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
  setTimeout(openWhatsApp, 1500); // Abre o zap automaticamente após 1.5s
}

function openWhatsApp() {
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

  const numero = "5511999999999"; // Substituir pelo número real
  const encodedText = encodeURIComponent(texto);
  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodedText}`;
  
  window.open(url, '_blank');
}

// Inicializa a App
render();
