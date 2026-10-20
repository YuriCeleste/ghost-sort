/**
 * ============================================================
 *  MAIN — Ghost Sort
 * ============================================================
 * Inicialização do jogo e funções principais.
 * ============================================================
 */
let idPartida = 0;

/* ---------- SELEÇÃO DE DIFICULDADE ---------- */
function selecionarDificuldade(nivel) {
  state.dificuldade = nivel;

  // Botões da tela de opções
  document.querySelectorAll('.btn-dificuldade-opcao').forEach(b => b.classList.remove('ativo'));
  const btnOpcao = document.querySelector(`.btn-dificuldade-opcao[data-nivel="${nivel}"]`);
  if (btnOpcao) btnOpcao.classList.add('ativo');

  // Atualiza o nome exibido no jogo
  const nome = NIVEIS[nivel].nome;
  const elJogo = document.getElementById('dificuldade-atual');
  const elOpcao = document.getElementById('opcao-atual-nome');
  if (elJogo) elJogo.textContent = nome;
  if (elOpcao) elOpcao.textContent = nome;
}

/* ---------- INICIAR JOGO ---------- */
function iniciarJogo() {
  idPartida++;
  const nivel = NIVEIS[state.dificuldade];

  state.totalFantasmas = nivel.total;
  state.listaJogador = gerarLista(state.totalFantasmas);
  state.listaComputador = [...state.listaJogador];
  state.selecionado = 0;
  state.comparacoesJogador = 0;
  state.comparacoesComputador = 0;
  state.tempo = 0;
  state.jogoAtivo = true;

  document.getElementById('dificuldade-atual').textContent = nivel.nome;
  
  document.getElementById('lista-jogador')
  .style.setProperty('--dur-mover', '180ms');

  state.chaveJogador = null;
  state.chaveComputador = null;

  renderizar();
  iniciarTimer();
  ordenarComputador();
  mostrarTela('jogo');
}

/* ---------- GERAR LISTA EMBARALHADA ---------- */
function gerarLista(n) {
  const lista = Array.from({ length: n }, (_, i) => i + 1);

  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }

  return lista;
}

/* ---------- ORDENAR COMPUTADOR (com animação) ---------- */
async function ordenarComputador() {
  const minhaPartida = idPartida;
  const delay = NIVEIS[state.dificuldade].velocidade;

  // a duração da animação acompanha a velocidade do nível
  document.getElementById('lista-computador')
    .style.setProperty('--dur-mover', Math.min(450, delay * 0.7) + 'ms');

  await insertionSort(state.listaComputador, async (lista, comp, info) => {
    if (minhaPartida !== idPartida || !state.jogoAtivo) return;

    state.comparacoesComputador = comp;
    state.chaveComputador = info.chave;
    renderizar();

    const espera =
      info.tipo === 'mover' ? delay :
      info.tipo === 'pular' ? delay * 0.4 :
      delay * 0.8; // levantar / inserir
    await sleep(espera);
  });

  if (minhaPartida === idPartida) {
    state.chaveComputador = null;
    renderizar();
    verificarVitoria();
  }
}

/* ---------- UTILITÁRIOS ---------- */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function estaOrdenado(lista) {
  for (let i = 0; i < lista.length - 1; i++) {
    if (lista[i] > lista[i + 1]) return false;
  }
  return true;
}

/* ---------- VERIFICAÇÃO DE VITÓRIA ---------- */
function verificarVitoria() {
  const jogadorOrdenado = estaOrdenado(state.listaJogador);
  const computadorOrdenado = estaOrdenado(state.listaComputador);

  if (jogadorOrdenado && state.jogoAtivo) {
    state.jogoAtivo = false;
    pararTimer();
    mostrarResultado('vitoria');
  } else if (computadorOrdenado && state.jogoAtivo) {
    state.jogoAtivo = false;
    pararTimer();
    mostrarResultado('derrota');
  }
}

/* ---------- INICIALIZAÇÃO (lê a URL) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  const telasValidas = ['menu', 'jogo', 'creditos', 'opcoes'];

  if (hash && telasValidas.includes(hash)) {
    mostrarTela(hash);
  } else {
    mostrarTela('menu');
  }
});

/* ---------- OUVIR MUDANÇAS NA URL (botão voltar/avançar) ---------- */
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  const telasValidas = ['menu', 'jogo', 'creditos', 'opcoes'];
  if (hash && telasValidas.includes(hash)) {
    mostrarTela(hash);
  }
});