import { Router } from "express";
import fs, { PathOrFileDescriptor } from "fs";
import path from "path";
const router = Router();

router.post("/matches", (req, res) => {
  const { title, location, date, time } = req.body;

  const match = {
    title,
    location,
    date,
    time,
    attendance: [],
  };
  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  // Adicione a nova partida aos dados existentes
  matchesData.push(match);

  // Salve os dados atualizados no arquivo JSON
  fs.writeFileSync(
    path.join(__dirname, "../db/matchers.json"),
    JSON.stringify(matchesData)
  );

  res.json(match);
});

router.put("/matches/:id/attendance", (req, res) => {
  // Obtenha o ID da partida a partir dos parâmetros da URL
  const matchId = req.params.id;

  // Obtenha os dados do jogador e seu telefone do corpo da requisição
  const { player, phone } = req.body;

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);
  // Encontre a partida correspondente pelo ID
  const match = matchesData.find((match) => match.id === matchId);

  if (!match) {
    // Caso a partida não seja encontrada, envie uma resposta de erro
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  // Adicione ou remova o jogador da lista de presença
  const attendance = match.attendance;
  const playerIndex = attendance.findIndex((entry) => entry.player === player);

  if (playerIndex > -1) {
    // O jogador já está na lista, remova-o
    attendance.splice(playerIndex, 1);
  } else {
    // O jogador não está na lista, adicione-o
    attendance.push({ player, phone });
  }

  // Salve os dados atualizados no arquivo JSON
  fs.writeFileSync("./data/matches.json", JSON.stringify(matchesData));

  // Envie a resposta com os dados atualizados da partida
  res.json(match);
});

router.get("/matches/:id/attendance", (req, res) => {
  // Obtenha o ID da partida a partir dos parâmetros da URL
  const matchId = req.params.id;

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  // Encontre a partida correspondente pelo ID
  const match = matchesData.find((match) => match.id === matchId);

  if (!match) {
    // Caso a partida não seja encontrada, envie uma resposta de erro
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  // Envie a resposta com os dados da lista de presença da partida
  res.json(match.attendance);
});

router.delete("/matches/:id", (req, res) => {
  // Obtenha o ID da partida a partir dos parâmetros da URL
  const matchId = req.params.id;

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  // Encontre o índice da partida correspondente pelo ID
  const matchIndex = matchesData.findIndex((match) => match.id === matchId);

  if (matchIndex === -1) {
    // Caso a partida não seja encontrada, envie uma resposta de erro
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  // Remova a partida do array de partidas
  matchesData.splice(matchIndex, 1);

  // Salve os dados atualizados no arquivo JSON
  fs.writeFileSync("./data/matches.json", JSON.stringify(matchesData));

  // Envie uma resposta de sucesso
  res.json({ success: true });
});
