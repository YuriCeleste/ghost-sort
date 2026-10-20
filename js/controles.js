/**
 * ============================================================
 *  CONTROLES
 * ============================================================
 * Teclado (setas) e mouse/toque (clicar e arrastar) para mover
 * o fantasma selecionado.
 * ============================================================
 */

/* ---------- MOVER O SELECIONADO UMA CASA ---------- */
// direcao: -1 = esquerda, +1 = direita
function moverSelecionado(direcao) {
  const i = state.selecionado;
  const j = i + direcao;
  if (j < 0 || j >= state.listaJogador.length) return;

  [state.listaJogador[i], state.listaJogador[j]] =
  [state.listaJogador[j], state.listaJogador[i]];

  state.selecionado = j;
  state.comparacoesJogador++;
  tocarSom('mover');
  renderizar();
  verificarVitoria();
}

/* ---------- TECLADO ---------- */
document.addEventListener('keydown', (e) => {
  if (!state.jogoAtivo) return;

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === 'ArrowLeft') {
    moverSelecionado(-1);
  } else if (e.key === 'ArrowRight') {
    moverSelecionado(1);
  } else if (e.key === 'ArrowUp' && state.selecionado > 0) {
    state.selecionado--;
    renderizar();
  } else if (e.key === 'ArrowDown' && state.selecionado < state.listaJogador.length - 1) {
    state.selecionado++;
    renderizar();
  }
});

/* ---------- MOUSE / TOQUE ---------- */
let arrastando = false;

// Descobre qual casa da lista está sob o ponteiro, usando a posição
// de layout (ignora animações em andamento, evitando "vai e volta").
function indiceNaPosicao(container, clientX, clientY) {
  const primeiro = container.querySelector('.fantasma');
  if (!primeiro) return -1;

  const pai = primeiro.offsetParent;
  const r = pai.getBoundingClientRect();
  const x = clientX - r.left - pai.clientLeft;
  const y = clientY - r.top - pai.clientTop;

  for (let i = 0; i < container.children.length; i++) {
    const f = container.children[i];
    if (
      x >= f.offsetLeft && x <= f.offsetLeft + f.offsetWidth &&
      y >= f.offsetTop  && y <= f.offsetTop + f.offsetHeight
    ) {
      return i;
    }
  }
  return -1;
}

document.addEventListener('pointerdown', (e) => {
  if (!state.jogoAtivo) return;

  const container = document.getElementById('lista-jogador');
  const el = e.target.closest('.fantasma');
  if (!el || !container.contains(el)) return;

  e.preventDefault();
  state.selecionado = Array.from(container.children).indexOf(el);
  arrastando = true;
  container.classList.add('arrastando');
  renderizar();
});

document.addEventListener('pointermove', (e) => {
  if (!arrastando || !state.jogoAtivo) return;

  const container = document.getElementById('lista-jogador');
  const alvo = indiceNaPosicao(container, e.clientX, e.clientY);
  if (alvo === -1) return;

  // anda casa por casa até chegar na posição do ponteiro
  while (state.jogoAtivo && state.selecionado !== alvo) {
    moverSelecionado(alvo > state.selecionado ? 1 : -1);
  }
});

function soltar() {
  arrastando = false;
  const container = document.getElementById('lista-jogador');
  if (container) container.classList.remove('arrastando');
}

document.addEventListener('pointerup', soltar);
document.addEventListener('pointercancel', soltar);