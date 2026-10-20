/**
 * ============================================================
 *  ESTADO DO JOGO
 * ============================================================
 * Aqui ficam as variáveis que representam o estado atual do jogo.
 * ============================================================
 */

const state = {
  dificuldade: 'facil',          // 'facil' | 'medio' | 'dificil'
  totalFantasmas: 5,
  listaJogador: [],
  listaComputador: [],
  selecionado: 0,
  chaveJogador: null,       // novo
  chaveComputador: null,    // novo
  comparacoesJogador: 0,
  comparacoesComputador: 0,
  tempo: 0,
  timer: null,
  jogoAtivo: false
};

const NIVEIS = {
  facil:   { nome: 'Fácil',   total: 5, velocidade: 1500 },
  medio:   { nome: 'Médio',   total: 8, velocidade: 800  },
  dificil: { nome: 'Difícil', total: 12, velocidade: 300  }
};