/**
 * ============================================================
 *  CONTROLES
 * ============================================================
 * Escuta as setas do teclado e move/troca o fantasma selecionado.
 * ============================================================
 */

document.addEventListener('keydown', (e) => {
  if (!state.jogoAtivo) return;

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }

  /* Esquerda: move o fantasma selecionado para a esquerda */
  if (e.key === 'ArrowLeft' && state.selecionado > 0) {
    [state.listaJogador[state.selecionado - 1], state.listaJogador[state.selecionado]] =
    [state.listaJogador[state.selecionado], state.listaJogador[state.selecionado - 1]];
    state.selecionado--;
    state.comparacoesJogador++;
    tocarSom('mover');
    renderizar();
    verificarVitoria();
  }

  /* Direita: move o fantasma selecionado para a direita */
  else if (e.key === 'ArrowRight' && state.selecionado < state.listaJogador.length - 1) {
    [state.listaJogador[state.selecionado + 1], state.listaJogador[state.selecionado]] =
    [state.listaJogador[state.selecionado], state.listaJogador[state.selecionado + 1]];
    state.selecionado++;
    state.comparacoesJogador++;
    tocarSom('mover');
    renderizar();
    verificarVitoria();
  }

  /* Cima: seleciona o fantasma anterior */
  else if (e.key === 'ArrowUp' && state.selecionado > 0) {
    state.selecionado--;
    tocarSom('mover');
    renderizar();
  }

  /* Baixo: seleciona o próximo fantasma */
  else if (e.key === 'ArrowDown' && state.selecionado < state.listaJogador.length - 1) {
    state.selecionado++;
    tocarSom('mover');
    renderizar();
  }
});