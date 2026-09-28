<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Digital Wallet – Design System</title>
<style>
:root{
  box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
  /* cores */
  --page:#a9b8a0; --page-ink:#1f2f23;
  --green-900:#26402c; --green-800:#2f4b35; --green-700:#3b5a41;
  --glass:rgba(255,255,255,.10); --glass-line:rgba(255,255,255,.14);
  --on-dark:#fff; --on-dark-muted:rgba(255,255,255,.58);
  --sheet:#fff; --ink:#15201a; --ink-muted:#7b877f; --line:#e7ece8;
  --lime:#dbf7a0; --income:#7dea9a; --expense:#fff;
  --c-green:#22a350; --c-purple:#6d4aff; --c-blue:#1e6fff; --c-orange:#f97316; --c-red:#e5484d;
  /* tipografia */
  --font:"Plus Jakarta Sans","Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --fs-xs:.66rem; --fs-sm:.78rem; --fs-md:.9rem; --fs-lg:1.05rem; --fs-xl:1.7rem;
  /* forma */
  --r-sm:12px; --r-md:18px; --r-lg:26px; --r-phone:44px; --r-pill:999px;
  --gap:14px;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--page:#1b2620;--page-ink:#e6efe8}}
:root[data-theme="dark"]{--page:#1b2620;--page-ink:#e6efe8}
*,*::before,*::after{box-sizing:inherit}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--page);color:var(--page-ink);font-family:var(--font);line-height:1.4}
main{max-width:1180px;margin:0 auto;padding:32px 20px 64px}
h1{font-size:clamp(2rem,6vw,3.4rem);margin:0 0 6px;letter-spacing:-.03em}
h2{font-size:1.2rem;margin:44px 0 14px}
p.lead{margin:0;max-width:60ch;opacity:.8}
button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
:focus-visible{outline:2px solid var(--lime);outline-offset:2px}

/* ===== tokens da página ===== */
.swatches{display:flex;flex-wrap:wrap;gap:10px}
.sw{width:112px;border-radius:var(--r-sm);overflow:hidden;background:#fff;color:#15201a;font-size:var(--fs-xs)}
.sw i{display:block;height:52px}
.sw span{display:block;padding:6px 8px}

/* ===== moldura do celular (só apresentação) ===== */
.phones{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px;justify-items:center}
.phone{position:relative;width:100%;max-width:360px;min-height:700px;border-radius:var(--r-phone);
  background:var(--green-800);color:var(--on-dark);overflow:hidden;display:flex;flex-direction:column;
  box-shadow:0 24px 50px -18px rgba(0,0,0,.45)}
.status{display:flex;justify-content:space-between;padding:18px 26px 6px;font-size:var(--fs-sm);font-weight:700}
.body{flex:1;padding:8px 18px 96px;display:flex;flex-direction:column;gap:var(--gap)}
.muted{color:var(--on-dark-muted)}
.small{font-size:var(--fs-xs)}

/* ===== componentes ===== */
.avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:var(--fs-sm);
  background:linear-gradient(135deg,#f6c89f,#b96b4a);color:#fff;flex:none}
.avatar.lg{width:52px;height:52px;font-size:var(--fs-md)}
.topbar{display:flex;align-items:center;gap:10px}
.topbar .grow{flex:1;min-width:0}
.icon-btn{width:36px;height:36px;border-radius:50%;background:var(--glass);border:1px solid var(--glass-line);display:grid;place-items:center}
.glass{background:var(--glass);border:1px solid var(--glass-line);border-radius:var(--r-md);padding:16px}
.balance{font-size:var(--fs-xl);font-weight:800;letter-spacing:-.02em}
.balance small{font-size:var(--fs-md);font-weight:600;opacity:.7}
.chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--r-pill);
  background:var(--glass);border:1px solid var(--glass-line);font-size:var(--fs-xs);font-weight:600}
.dot{width:14px;height:14px;border-radius:50%;display:inline-block}
.actions{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.action{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 4px;border-radius:var(--r-md);
  background:var(--glass);border:1px solid var(--glass-line);font-size:var(--fs-xs);font-weight:600}
.action b{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;font-size:1rem}
.pill-btn{padding:8px 16px;border-radius:var(--r-pill);background:rgba(255,255,255,.16);font-size:var(--fs-xs);font-weight:700}

/* sheet branca */
.sheet{background:var(--sheet);color:var(--ink);border-radius:var(--r-lg);padding:16px;display:flex;flex-direction:column;gap:14px}
.sheet .row-h{display:flex;justify-content:space-between;align-items:center;font-weight:700}
.sheet .row-h a{font-size:var(--fs-xs);font-weight:600;color:var(--ink-muted)}
.contacts{display:flex;justify-content:space-between;text-align:center;font-size:var(--fs-xs);color:var(--ink-muted)}
.contacts div{display:flex;flex-direction:column;align-items:center;gap:6px}
.avatar.add{background:#fff;color:var(--ink-muted);border:1px solid var(--line);font-size:1.2rem}
.trend{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--line);border-radius:var(--r-md)}
.trend .grow{flex:1}.trend svg{width:76px;height:26px}
.trend .val{text-align:right;font-weight:800;font-size:var(--fs-sm)}
.trend .val small{display:block;color:var(--c-red);font-weight:600;font-size:var(--fs-xs)}

/* cartão */
.cc{background:var(--lime);color:#1b2a16;border-radius:var(--r-md);padding:20px;min-height:170px;
  display:flex;flex-direction:column;justify-content:space-between}
.cc .top{display:flex;justify-content:space-between;align-items:center}
.chipcard{width:38px;height:28px;border-radius:6px;background:linear-gradient(135deg,#f5b53d,#e58a1f)}
.brand{font-weight:900;font-style:italic;font-size:1.3rem;color:#2c3ea8}
.cc .num{font-size:var(--fs-lg);font-weight:600;letter-spacing:.06em}
.cc .meta{display:flex;justify-content:space-between;font-size:var(--fs-sm);font-weight:700}
.cc .meta small{display:block;font-size:.55rem;font-weight:500;opacity:.6}
.card-row{display:grid;grid-template-columns:52px 1fr;gap:10px}
.add-card{border-radius:var(--r-md);background:var(--glass);border:1px solid var(--glass-line);
  display:grid;place-items:center;font-size:var(--fs-xs);font-weight:600;writing-mode:vertical-rl;transform:rotate(180deg)}
.pager{display:flex;justify-content:center;gap:5px}
.pager i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.4)}
.pager i:first-child{width:18px;border-radius:var(--r-pill);background:#fff}
.progress{height:5px;border-radius:var(--r-pill);background:rgba(255,255,255,.16);overflow:hidden;margin:6px 0 12px}
.progress i{display:block;height:100%;background:#fff;border-radius:inherit}
.limit{display:flex;justify-content:space-between;font-size:var(--fs-xs)}
.setting{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid var(--line);font-size:var(--fs-sm);color:var(--ink-muted)}
.toggle{width:40px;height:24px;border-radius:var(--r-pill);background:#15201a;position:relative}
.toggle::after{content:"";position:absolute;top:3px;right:3px;width:18px;height:18px;border-radius:50%;background:#fff}
.toggle[aria-checked="false"]{background:#cfd8d2}.toggle[aria-checked="false"]::after{right:auto;left:3px}

/* atividade */
.phone.light-top .top-sheet{background:#fff;color:var(--ink);border-radius:0 0 var(--r-lg) var(--r-lg);padding:0 18px 18px;margin:0 0 6px}
.phone.light-top .status{background:#fff;color:var(--ink);padding-bottom:10px}
.tabs{display:flex;background:#eef2ef;border-radius:var(--r-pill);padding:4px}
.tabs button{flex:1;padding:8px;border-radius:var(--r-pill);font-size:var(--fs-xs);font-weight:700;color:var(--ink-muted)}
.tabs button[aria-selected="true"]{background:var(--green-800);color:#fff}
.group-title{font-weight:700;margin:6px 0 0}
.tx{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--glass-line)}
.tx:last-child{border-bottom:0}
.tx .ico{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:none;color:#fff}
.tx .grow{flex:1;min-width:0;font-size:var(--fs-sm);font-weight:700}
.tx .grow small,.tx .amt small{display:block;font-weight:500;font-size:var(--fs-xs);color:var(--on-dark-muted)}
.tx .amt{text-align:right;font-size:var(--fs-sm);font-weight:700}
.amt.in{color:var(--income)}

/* nav inferior */
.nav{position:absolute;left:0;right:0;bottom:0;background:var(--green-900);border-radius:var(--r-lg) var(--r-lg) var(--r-phone) var(--r-phone);
  display:grid;grid-template-columns:1fr 1fr 64px 1fr 1fr;align-items:end;padding:12px 10px 16px}
.nav button{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:var(--fs-xs);color:var(--on-dark-muted);font-weight:600}
.nav button[aria-current="page"]{color:#fff}
.nav .scan{width:56px;height:56px;border-radius:50%;background:var(--green-700);color:#fff;margin:-34px auto 0;
  border:4px solid var(--green-800);display:grid;place-items:center;font-size:1.3rem}

@media (prefers-reduced-motion:no-preference){.toggle,.toggle::after,.progress i{transition:.2s}}
</style>
</head>
<body>
<main>
  <h1>Digital Wallet</h1>
  <p class="lead">Design system extraído das 3 telas (Home, Meu cartão, Atividade). Tudo é feito com variáveis CSS e componentes fluidos, então você reaproveita em layouts web.</p>

  <h2>Tokens de cor</h2>
  <div class="swatches">
    <div class="sw"><i style="background:#2f4b35"></i><span>--green-800<br>fundo</span></div>
    <div class="sw"><i style="background:#26402c"></i><span>--green-900<br>nav / profundo</span></div>
    <div class="sw"><i style="background:#3b5a41"></i><span>--green-700<br>botão central</span></div>
    <div class="sw"><i style="background:#dbf7a0"></i><span>--lime<br>cartão / destaque</span></div>
    <div class="sw"><i style="background:#a9b8a0"></i><span>--page<br>fundo da página</span></div>
    <div class="sw"><i style="background:#fff;border-bottom:1px solid #ddd"></i><span>--sheet<br>painéis brancos</span></div>
    <div class="sw"><i style="background:#7dea9a"></i><span>--income</span></div>
    <div class="sw"><i style="background:#6d4aff"></i><span>--c-purple</span></div>
    <div class="sw"><i style="background:#1e6fff"></i><span>--c-blue</span></div>
    <div class="sw"><i style="background:#f97316"></i><span>--c-orange</span></div>
  </div>

  <h2>Telas</h2>
  <div class="phones">

    <!-- HOME -->
    <section class="phone" aria-label="Home">
      <div class="status"><span>9:41</span><span>●●● ▮</span></div>
      <div class="body">
        <div class="topbar">
          <div class="avatar lg">AM</div>
          <div class="grow"><div class="small muted">Bem-vindo de volta!</div><b>Abdullah Al Mamun</b></div>
          <button class="icon-btn" aria-label="Buscar">⌕</button>
          <button class="icon-btn" aria-label="Notificações">🔔</button>
        </div>
        <div class="glass">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div><div class="balance">$16.450<small>,00</small></div><div class="small muted" style="margin-top:6px">Saldo total</div></div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
              <span class="chip"><i class="dot" style="background:var(--c-green)"></i>Crédito</span>
              <span class="chip"><i class="dot" style="background:var(--c-orange)"></i>Virtual</span>
              <span class="chip"><i class="dot" style="background:var(--c-blue)"></i>Débito</span>
            </div>
          </div>
          <button class="pill-btn" style="margin-top:8px">Ver mais</button>
        </div>
        <div class="actions">
          <button class="action"><b>$</b>Enviar</button>
          <button class="action"><b>↙</b>Receber</button>
          <button class="action"><b>▣</b>Escanear</button>
          <button class="action"><b>+</b>Adicionar</button>
        </div>
        <div class="sheet">
          <div class="row-h">Envio rápido <a href="#">Ver todos</a></div>
          <div class="contacts">
            <div><span class="avatar lg">ED</span>Edwards</div>
            <div><span class="avatar lg" style="background:linear-gradient(135deg,#f3b6c4,#a5566b)">CO</span>Colleen</div>
            <div><span class="avatar lg" style="background:linear-gradient(135deg,#9ec5e8,#3d6c99)">RI</span>Richars</div>
            <div><span class="avatar lg" style="background:linear-gradient(135deg,#c9a0e8,#6a3d99)">VI</span>Victorea</div>
            <div><span class="avatar lg add">+</span>Novo</div>
          </div>
          <div class="row-h">Transações recentes <a href="#">Ver todas</a></div>
          <div class="trend">
            <span class="avatar">A</span>
            <div class="grow"><b style="font-size:var(--fs-sm)">Amazon</b><div class="small" style="color:var(--ink-muted)">14:36</div></div>
            <svg viewBox="0 0 76 26" fill="none" stroke="var(--c-red)" stroke-width="1.6"><path d="M0 14 C10 4 16 22 26 12 S42 2 50 14 S66 20 76 10"/></svg>
            <div class="val">$24,99<small>▼ 4,32%</small></div>
          </div>
        </div>
      </div>
      <nav class="nav" aria-label="Principal">
        <button aria-current="page"><span>⌂</span>Início</button>
        <button><span>▭</span>Cartões</button>
        <button class="scan" aria-label="Escanear">▣</button>
        <button><span>◷</span>Atividade</button>
        <button><span>☺</span>Perfil</button>
      </nav>
    </section>

    <!-- MEU CARTÃO -->
    <section class="phone" aria-label="Meu cartão">
      <div class="status"><span>9:41</span><span>●●● ▮</span></div>
      <div class="body">
        <div class="topbar">
          <button class="icon-btn" aria-label="Voltar">‹</button>
          <b class="grow" style="text-align:center">Meu cartão</b>
          <button class="icon-btn" aria-label="Adicionar">+</button>
        </div>
        <div class="card-row">
          <div class="add-card">Adicionar cartão</div>
          <div class="cc">
            <div class="top"><span class="chipcard"></span><span class="brand">VISA</span></div>
            <div class="num">1432 5096 2031 4683</div>
            <div class="meta"><span><small>TITULAR</small>Arian Munna</span><span><small>VALIDADE</small>04/28</span><span><small>CVV</small>162</span></div>
          </div>
        </div>
        <div class="pager"><i></i><i></i><i></i></div>
        <div class="glass" style="display:flex;align-items:center;gap:12px">
          <span class="icon-btn">▭</span>
          <div style="flex:1"><div class="small muted">Saldo do cartão</div><b>$5.750,00</b></div>
          <button class="pill-btn">Recarregar</button>
        </div>
        <div class="glass">
          <b style="font-size:var(--fs-sm)">Limites do cartão</b>
          <div class="limit" style="margin-top:12px"><span class="muted">Limite diário</span><span>$2.000 / $5.000</span></div>
          <div class="progress"><i style="width:40%"></i></div>
          <div class="limit"><span class="muted">Limite mensal</span><span>$5.750 / $20.000</span></div>
          <div class="progress" style="margin-bottom:0"><i style="width:29%"></i></div>
        </div>
        <div class="sheet">
          <b style="font-size:var(--fs-sm)">Configurações do cartão</b>
          <div class="setting">Congelar cartão <button class="toggle" role="switch" aria-checked="true" aria-label="Congelar cartão" onclick="this.setAttribute('aria-checked',this.getAttribute('aria-checked')!=='true')"></button></div>
          <div class="setting">Alterar PIN <span>›</span></div>
        </div>
      </div>
      <nav class="nav" aria-label="Principal">
        <button><span>⌂</span>Início</button>
        <button aria-current="page"><span>▭</span>Cartões</button>
        <button class="scan" aria-label="Escanear">▣</button>
        <button><span>◷</span>Atividade</button>
        <button><span>☺</span>Perfil</button>
      </nav>
    </section>

    <!-- ATIVIDADE -->
    <section class="phone light-top" aria-label="Atividade">
      <div class="status"><span>9:41</span><span>●●● ▮</span></div>
      <div class="top-sheet">
        <div class="topbar" style="margin-bottom:12px">
          <button class="icon-btn" style="background:#eef2ef;border-color:transparent" aria-label="Voltar">‹</button>
          <b class="grow" style="text-align:center">Atividade</b>
          <button class="icon-btn" style="background:#eef2ef;border-color:transparent" aria-label="Filtrar">⏷</button>
        </div>
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="true" onclick="tab(this)">Todas</button>
          <button role="tab" aria-selected="false" onclick="tab(this)">Receitas</button>
          <button role="tab" aria-selected="false" onclick="tab(this)">Despesas</button>
        </div>
      </div>
      <div class="body">
        <div class="group-title">Hoje</div>
        <div class="tx"><span class="ico" style="background:var(--c-green)">↓</span><div class="grow">Dinheiro recebido<small>De Sarah Johnson</small></div><div class="amt in">+$150,00<small>10:30</small></div></div>
        <div class="tx"><span class="ico" style="background:var(--c-purple)">↑</span><div class="grow">Dinheiro enviado<small>Para John Doe</small></div><div class="amt">-$80,00<small>09:15</small></div></div>
        <div class="tx"><span class="ico" style="background:var(--c-blue)">🛍</span><div class="grow">Amazon<small>Compra online</small></div><div class="amt">-$45,90<small>08:45</small></div></div>
        <div class="tx"><span class="ico" style="background:var(--c-orange)">☕</span><div class="grow">Starbucks<small>Cafeteria</small></div><div class="amt">-$5,00<small>08:20</small></div></div>
        <div class="group-title" style="margin-top:14px">Ontem</div>
        <div class="tx"><span class="ico" style="background:#000;font-weight:900;color:#e50914">N</span><div class="grow">Netflix<small>Entretenimento</small></div><div class="amt">-$15,99<small>Ontem</small></div></div>
        <div class="tx"><span class="ico" style="background:#fff;color:var(--c-green)">▤</span><div class="grow">Salário recebido<small>Tech Corp</small></div><div class="amt in">+$2.500,00<small>Ontem</small></div></div>
      </div>
      <nav class="nav" aria-label="Principal">
        <button><span>⌂</span>Início</button>
        <button><span>▭</span>Cartões</button>
        <button class="scan" aria-label="Escanear">▣</button>
        <button aria-current="page"><span>◷</span>Atividade</button>
        <button><span>☺</span>Perfil</button>
      </nav>
    </section>
  </div>
</main>
<script>
function tab(el){el.parentNode.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b===el))}
</script>
</body>
</html>