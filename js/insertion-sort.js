/**
 * ============================================================
 *  INSERTION SORT
 * ============================================================
 * Este é o coração do "cérebro do computador".
 *
 * O algoritmo funciona como você ordena cartas na mão:
 *   1. Pega a próxima carta (a "chave").
 *   2. Compara com as cartas à esquerda.
 *   3. Enquanto a da esquerda for maior, ela "anda" para a direita.
 *   4. Quando achar uma menor (ou o início), insere a chave ali.
 *
 * Complexidade:
 *   - Melhor caso (já ordenada): O(n)
 *   - Pior caso (invertida):     O(n²)
 * ============================================================
 */

async function insertionSort(lista, onPasso) {
  let comparacoes = 0;

  for (let i = 1; i < lista.length; i++) {
    const chave = lista[i];
    let j = i - 1;

    // Já está no lugar: só conta a comparação e segue (sem levantar)
    if (lista[j] <= chave) {
      comparacoes++;
      if (onPasso) await onPasso(lista, comparacoes, { tipo: 'pular', chave: null });
      continue;
    }

    // 1) AFASTAR: levanta a chave
    if (onPasso) await onPasso(lista, comparacoes, { tipo: 'levantar', chave });

    // 2) MOVER: a chave troca com cada vizinho maior, andando pra esquerda
    while (j >= 0 && lista[j] > chave) {
      comparacoes++;
      [lista[j], lista[j + 1]] = [lista[j + 1], lista[j]];
      j--;
      if (onPasso) await onPasso(lista, comparacoes, { tipo: 'mover', chave });
    }

    if (j >= 0) comparacoes++;

    // 3) INSERIR: solta a chave no espaço aberto
    if (onPasso) await onPasso(lista, comparacoes, { tipo: 'inserir', chave: null });
  }

  return comparacoes;
}