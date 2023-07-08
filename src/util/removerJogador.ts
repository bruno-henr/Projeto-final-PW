export function removerJogador(partidas, nomeJogador) {
  for (let i = 0; i < partidas.length; i++) {
    const partida = partidas[i];
    const timeAzul = partida.attendance.timeAzul;
    const timeVermelho = partida.attendance.timeVermelho;

    // Verifica e remove do time azul
    for (let j = 0; j < timeAzul.length; j++) {
      if (timeAzul[j].nome === nomeJogador) {
        timeAzul.splice(j, 1);
        console.log(
          `O jogador ${nomeJogador} foi removido do time azul na partida ${partida.titulo}`
        );
        return;
      }
    }

    // Verifica e remove do time vermelho
    for (let k = 0; k < timeVermelho.length; k++) {
      if (timeVermelho[k].nome === nomeJogador) {
        timeVermelho.splice(k, 1);
        console.log(
          `O jogador ${nomeJogador} foi removido do time vermelho na partida ${partida.titulo}`
        );
        return;
      }
    }
  }

  console.log(
    `O jogador ${nomeJogador} não foi encontrado em nenhuma partida.`
  );
}
