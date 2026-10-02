const state = {
  currentScreen: 1,
  data: {
    segmento: '',
    regime: '',
    necessidade: '',
    usuarios: 1,
    modulos: {},
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
                <label class="option-card ${state.data.modulos[mod.id] ? 'selected' : ''}">
                  <input type="checkbox" ${state.data.modulos[mod.id] ? 'checked' : ''} onchange="updateModulo('${mod.id}', this.checked); render()">
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
      content = `
        <div class="screen">
          ${renderProgress(5)}
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

    case 6:
      content = `
        <div class="screen">
          ${renderProgress(6)}
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
}

// Helpers
function updateState(field, value) {
  state.data[field] = value;
}
function updateModulo(id, checked) {
  state.data.modulos[id] = checked;
}
function updateLead(field, value) {
  state.data.lead[field] = value;
}
function nextScreen() {
  state.currentScreen++;
  render();
}
function prevScreen() {
  state.currentScreen--;
  if (state.currentScreen === 4 && state.data.necessidade === 'fiscal') {
    state.currentScreen--; // Pula a tela 4 se for fiscal
  }
  render();
}
function goToModulos() {
  if (state.data.necessidade === 'fiscal') {
    state.currentScreen = 5; // Pula os módulos diretos para Captação
  } else {
    state.currentScreen = 4;
  }
  render();
}
function resetApp() {
  state.currentScreen = 1;
  state.data = { segmento: '', regime: '', necessidade: '', usuarios: 1, modulos: {}, lead: { nome: '', empresa: '', whatsapp: '', email: '' } };
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

  const totalCalculado = valorPlano + valorExtras + valorModulos;

  state.resultado = {
    nomePlano, valorPlano, extras, valorExtras,
    modulosNomes, modulosValoresFormatados, modulosConsulta,
    valorModulos, totalCalculado
  };

  state.currentScreen = 6;
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
