const mongoDB = require("./launches.mongo");
const spacexAPI = require("./launches.spacex");

async function isSpaceXDataLoaded() {
  const lastestLaunch = await spacexAPI.getLastestLaunch();
  const filter = {
    mission: lastestLaunch.name,
    launchDate: new Date(lastestLaunch.date_local),
    upcoming: lastestLaunch.upcoming,
  };
  return mongoDB.isExist(filter);
}

async function loadSpaceXLaunches() {
  if (await isSpaceXDataLoaded()) {
    console.log("SpaceX launches is already loaded");
    return;
  }

  const spacexLaunches = await spacexAPI.getLaunches();
  for (const spacexLaunch of spacexLaunches) {
    await mongoDB.addNewLaunch(spacexLaunch);
  }
  console.log("Loaded new SpaceX launches");
}

async function addNewLaunch(launch) {
  await mongoDB.addNewLaunch(launch);
}

async function getAllLaunches(page, limit) {
  return await mongoDB.getAllLaunches(page, limit);
}

async function abortLaunchByID(id) {
  return await mongoDB.abortLaunchByID(id);
}

module.exports = {
  loadSpaceXLaunches,
  addNewLaunch,
  getAllLaunches,
  abortLaunchByID,
};
