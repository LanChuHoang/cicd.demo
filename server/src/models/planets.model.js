const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

const options = {
  comment: "#",
  columns: true,
};
const DATA_FILE_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "kepler_data.csv"
);

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(DATA_FILE_PATH)
      .pipe(parse(options))
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await storePlanet(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      })
      .on("end", async () => {
        console.log(
          `${(await getAllPlanets()).length} habitable planets were found`
        );
        resolve();
      });
  });
}

async function storePlanet(planet) {
  try {
    await planets.updateOne({ keplerName: planet.kepler_name }, planet, {
      upsert: true,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getAllPlanets() {
  const filter = {};
  const projection = {
    _id: 0,
    __v: 0,
  };
  return await planets.find(filter, projection);
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
