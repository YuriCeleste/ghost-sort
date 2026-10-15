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
  comparacoesJogador: 0,
  comparacoesComputador: 0,
  tempo: 0,
  timer: null,
  jogoAtivo: false
};

const NIVEIS = {
  facil:   { total: 5,  nome: 'Fácil' },
  medio:   { total: 8,  nome: 'Médio' },
  dificil: { total: 12, nome: 'Difícil' }
};