import { Router } from "express";
import fs, { PathOrFileDescriptor } from "fs";
import path from "path";
const router = Router();
import { v4 as uuidv4 } from "uuid";

router.post("/matches", (req, res) => {
  const { titulo, local, data, hora } = req.body;

  const match = {
    titulo,
    local,
    data,
    hora,
    attendance: [],
  };
  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  matchesData.push({ ...match, id: uuidv4() });

  fs.writeFileSync(
    path.join(__dirname, "../db/matchers.json"),
    JSON.stringify(matchesData)
  );

  res.json(match);
});

router.delete("/matches/:id/attendance", (req, res) => {
  const matchId = req.params.id;
  const { player } = req.body;
  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  const match = matchesData.find((match) => match.id === matchId);
  if (!match) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  const timeAzul = match.attendance.timeAzul;
  const timeVermelho = match.attendance.timeVermelho;

  // Verifica e remove do time azul
  for (let j = 0; j < timeAzul.length; j++) {
    if (timeAzul[j].nome === player) {
      timeAzul.splice(j, 1);
      console.log(
        `O jogador ${player} foi removido do time azul na partida ${match.titulo}`
      );
      fs.writeFileSync(
        path.join(__dirname, "../db/matchers.json"),
        JSON.stringify(matchesData)
      );

      res.json(match);
      return;
    }
  }

  // Verifica e remove do time vermelho
  for (let k = 0; k < timeVermelho.length; k++) {
    if (timeVermelho[k].nome === player) {
      timeVermelho.splice(k, 1);
      console.log(
        `O jogador ${player} foi removido do time vermelho na partida ${match.titulo}`
      );
      fs.writeFileSync(
        path.join(__dirname, "../db/matchers.json"),
        JSON.stringify(matchesData)
      );

      res.json(match);
      return;
    }
  }
});

router.put("/matches/:id/attendance", (req, res) => {
  const matchId = req.params.id;

  const jogadores = req.body;
  console.log("lista de jogadores =>", jogadores);

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);
  const match = matchesData.find((match) => match.id === matchId);
  console.log("match finded", match);
  if (!match) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }
  match.attendance = jogadores;

  fs.writeFileSync(
    path.join(__dirname, "../db/matchers.json"),
    JSON.stringify(matchesData)
  );

  res.json(match);
});

router.get("/matches/", (req, res) => {
  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  if (!matchesData) {
    res.status(404).json({ error: "Partidas não encontradas." });
    return;
  }

  res.json(matchesData);
});

router.get("/matches/:id/attendance", (req, res) => {
  const matchId = req.params.id;

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  const match = matchesData.find((match) => match.id === matchId);

  if (!match) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  res.json(match.attendance);
});

router.delete("/matches/:id", (req, res) => {
  const matchId = req.params.id;

  const data_file = fs.readFileSync(
    path.join(__dirname, "../db/matchers.json"),
    "utf8"
  );
  const matchesData = JSON.parse(data_file);

  const matchIndex = matchesData.findIndex((match) => match.id === matchId);

  if (matchIndex === -1) {
    res.status(404).json({ error: "Partida não encontrada." });
    return;
  }

  matchesData.splice(matchIndex, 1);

  fs.writeFileSync(
    path.join(__dirname, "../db/matchers.json"),
    JSON.stringify(matchesData)
  );

  res.json({ success: true });
});

export { router };
