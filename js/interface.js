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

function renderizarLista(id, lista, ehJogador) {
  const container = document.getElementById(id);
  if (!container) return;

  container.innerHTML = '';

  lista.forEach((valor, index) => {
    const div = document.createElement('div');
    div.className = 'fantasma';

    // Alterna entre os 3 fantasmas (0, 1, 2) de forma determinística
    const fantasmaId = (valor - 1) % 3;
    const lado = ehJogador ? 'jogador' : 'computador';

    div.innerHTML = `
      <img src="assets/imagens/fantasma${fantasmaId}.png"
           alt="Fantasma ${valor}"
           class="fantasma-img fantasma-${lado}">
      <span class="fantasma-numero">${valor}</span>
    `;

    if (valor === index + 1) {
      div.classList.add('correto');
    }

    if (ehJogador && index === state.selecionado) {
      div.classList.add('selecionado');
    }

    if (ehJogador) {
      div.onclick = () => {
        state.selecionado = index;
        renderizar();
      };
    }

    container.appendChild(div);
  });
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