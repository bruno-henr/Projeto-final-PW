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
