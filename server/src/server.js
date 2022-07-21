const http = require("http");
const app = require("./app");
require("dotenv").config();
const { connectMongo } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadSpaceXLaunches } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function loadModelData() {
  await loadPlanetsData();
  await loadSpaceXLaunches();
}

async function startServer() {
  await connectMongo();
  await loadModelData();
  server.listen(PORT, () => {
    console.log("Server running at address http://localhost:" + PORT);
  });
}

startServer();
