/**
 * ============================================================
 *  TIMER
 * ============================================================
 * Cronômetro do jogo.
 * ============================================================
 */

function iniciarTimer() {
  pararTimer();
  state.tempo = 0;
  atualizarTempo();

  state.timer = setInterval(() => {
    state.tempo++;
    atualizarTempo();
  }, 1000);
}

function pararTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

function atualizarTempo() {
  const min = String(Math.floor(state.tempo / 60)).padStart(2, '0');
  const seg = String(state.tempo % 60).padStart(2, '0');
  document.getElementById('tempo').textContent = `${min}:${seg}`;
}