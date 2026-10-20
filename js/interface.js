/**
 * ============================================================
 *  INTERFACE — Ghost Sort
 * ============================================================
 * Manipulação do DOM: troca telas, renderiza listas, mostra resultado.
 * ============================================================
 */

/* ---------- NAVEGAÇÃO ENTRE TELAS ---------- */
function mostrarTela(id) {
  // Esconde TODAS as telas
  document.querySelectorAll('.tela').forEach(t => {
    t.classList.remove('ativa');
  });

  // Mostra só a tela pedida
  const tela = document.getElementById('tela-' + id);
  if (tela) {
    tela.classList.add('ativa');
  }

  // Atualiza a URL (sem recarregar a página)
  if (history.replaceState) {
    history.replaceState(null, '', '#' + id);
  } else {
    window.location.hash = id;
  }

  // Rola pro topo
  window.scrollTo(0, 0);
}

/* ---------- RENDERIZAÇÃO ---------- */
function renderizar() {
  renderizarLista('lista-jogador', state.listaJogador, true);
  renderizarLista('lista-computador', state.listaComputador, false);

  const cj = document.getElementById('comp-jogador');
  const cc = document.getElementById('comp-computador');
  if (cj) cj.textContent = state.comparacoesJogador;
  if (cc) cc.textContent = state.comparacoesComputador;
}

function criarFantasma(valor, lado) {
  const div = document.createElement('div');
  div.className = 'fantasma';
  div.dataset.valor = valor;

  // Alterna entre os 3 fantasmas (0, 1, 2) de forma determinística
  const fantasmaId = (valor - 1) % 3;

  div.innerHTML = `
    <img src="assets/imagens/fantasma${fantasmaId}.png"
         alt="Fantasma ${valor}"
         class="fantasma-img fantasma-${lado}">
    <span class="fantasma-numero">${valor}</span>
  `;
  return div;
}

function renderizarLista(id, lista, ehJogador) {
  const container = document.getElementById(id);
  if (!container) return;

  const lado = ehJogador ? 'jogador' : 'computador';
  const chave = ehJogador ? state.chaveJogador : state.chaveComputador;

  // FIRST: guarda a posição atual de cada fantasma
  const existentes = new Map();
  const antes = new Map();

  container.querySelectorAll('.fantasma').forEach(el => {
    const v = Number(el.dataset.valor);
    existentes.set(v, el);

    // deslocamento "em andamento" (se a animação anterior não terminou)
    const t = getComputedStyle(el).translate;
    let tx = 0, ty = 0;
    if (t && t !== 'none') {
      const partes = t.split(' ');
      tx = parseFloat(partes[0]) || 0;
      ty = parseFloat(partes[1]) || 0;
    }

    antes.set(v, { x: el.offsetLeft + tx, y: el.offsetTop + ty });
  });

  // remove fantasmas que não existem mais (ex.: mudou a dificuldade)
  existentes.forEach((el, v) => {
    if (!lista.includes(v)) {
      el.remove();
      existentes.delete(v);
    }
  });

  // reaproveita/cria os elementos e reordena no DOM
  lista.forEach((valor, index) => {
    let el = existentes.get(valor);
    if (!el) {
      el = criarFantasma(valor, lado);
      existentes.set(valor, el);
    }

    if (container.children[index] !== el) {
      container.insertBefore(el, container.children[index] || null);
    }

    el.classList.toggle('correto', valor === index + 1);
    el.classList.toggle('selecionado', ehJogador && index === state.selecionado);
    el.classList.toggle('levantado', valor === chave);

    if (ehJogador) {
      el.onclick = () => {
        state.selecionado = index;
        renderizar();
      };
    }
  });

  // LAST + INVERT: posição nova menos a antiga vira um deslocamento inicial
  const animados = [];
  lista.forEach(valor => {
    const pos = antes.get(valor);
    if (!pos) return;
    const el = existentes.get(valor);
    const dx = pos.x - el.offsetLeft;
    const dy = pos.y - el.offsetTop;
    if (dx || dy) {
      el.style.transition = 'none';
      el.style.translate = `${dx}px ${dy}px`;
      animados.push(el);
    }
  });

  // PLAY: libera a transição e anima até a posição final
  if (animados.length) {
    void container.offsetWidth; // força o navegador a aplicar o estado inicial
    animados.forEach(el => {
      el.style.transition = '';
      el.style.translate = '0px 0px';
    });
  }
}

/* ---------- MODAL DE RESULTADO ---------- */
function mostrarResultado(tipo) {
  const modal = document.getElementById('tela-resultado');
  const titulo = document.getElementById('resultado-titulo');
  const mensagem = document.getElementById('resultado-mensagem');
  const conteudo = modal.querySelector('.modal-conteudo');

  if (tipo === 'vitoria') {
    titulo.textContent = '🎉 VOCÊ VENCEU! 🎉';
    mensagem.textContent = 'Você libertou todos os fantasmas antes do computador.';
    if (conteudo) conteudo.style.borderColor = 'var(--dourado)';
  } else {
    titulo.textContent = '💀 VOCÊ PERDEU 💀';
    mensagem.textContent = 'O computador libertou todos os fantasmas antes de você.';
    if (conteudo) conteudo.style.borderColor = 'var(--errado)';
  }

  const elTempo = document.getElementById('resultado-tempo');
  const elCJ = document.getElementById('resultado-comp-jogador');
  const elCC = document.getElementById('resultado-comp-computador');
  const elTempoOriginal = document.getElementById('tempo');

  if (elTempo && elTempoOriginal) elTempo.textContent = elTempoOriginal.textContent;
  if (elCJ) elCJ.textContent = state.comparacoesJogador;
  if (elCC) elCC.textContent = state.comparacoesComputador;

  modal.classList.add('ativo');
}

function fecharResultado() {
  const modal = document.getElementById('tela-resultado');
  if (modal) modal.classList.remove('ativo');
}