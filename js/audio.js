/**
 * ============================================================
 *  ÁUDIO — Ghost Sort
 * ============================================================
 * Efeitos sonoros do jogo.
 * ============================================================
 */

const SONS = {
  mover: { src: 'assets/card-shuffle-echo.wav', volume: 0.5 }
};

const bancoDeSons = {};

function tocarSom(nome, volume) {
  const config = SONS[nome];
  if (!config) return;

  // carrega uma vez e reaproveita
  if (!bancoDeSons[nome]) {
    bancoDeSons[nome] = new Audio(config.src);
  }

  // clona para permitir sons sobrepostos (setas apertadas rápido)
  const som = bancoDeSons[nome].cloneNode();
  som.volume = volume ?? config.volume;
  som.play().catch(() => {}); // ignora bloqueio de autoplay do navegador
}