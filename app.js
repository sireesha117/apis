const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("connected");
    });
  } catch (e) {
    console.log("catch error");
    process.exit();
  }
};
initializeDBAndServer();
//get players
app.get("/players/", async (request, response) => {
  const getPlayerDetails = `select * from cricket_team`;
  const playerArray = await db.all(getPlayerDetails);
  response.send(playerArray);
});

//post
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(request.body);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerDetails = `insert into cricket_team (player_name,jersey_number,role) values ('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addPlayerDetails);
  const playerId = dbResponse.player_id;
  response.send("Player Added to Team");
});

//get player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  console.log(playerId);
  const getPlayerDetails = `select * from cricket_team where player_id=${playerId};`;
  const runPlayerDetails = await db.get(getPlayerDetails);
  console.log(runPlayerDetails);
  response.send(runPlayerDetails);
});
//update player
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayersQuery = `update cricket_team set player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}'
  where player_id=${playerId};`;
  await db.run(updatePlayersQuery);
  response.send("Player Details Updated");
});
//delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `delete from cricket_team where player_id=${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
