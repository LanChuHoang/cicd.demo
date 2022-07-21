const launchesModel = require("../../models/launches.model");

async function addNewLaunch(req, res) {
  const newLaunch = req.body;
  const requiredProperties = [
    newLaunch.launchDate,
    newLaunch.mission,
    newLaunch.rocket,
    newLaunch.target,
  ];

  if (requiredProperties.some((p) => p === undefined)) {
    return res.status(400).json({
      error: "Missing required properties of a launch",
    });
  }

  newLaunch.launchDate = new Date(newLaunch.launchDate);
  if (isNaN(newLaunch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await launchesModel.addNewLaunch(newLaunch);
  return res.status(201).json(newLaunch);
}

async function getAllLaunches(req, res) {
  const { page, limit } = req.query;
  const data = await launchesModel.getAllLaunches(Number(page), Number(limit));
  // data.page = page;
  // data.limit = limit;
  return res.status(200).json(data);
}

async function abortLaunch(req, res) {
  const launchID = Number(req.params.launchID);
  if (isNaN(launchID)) {
    return res.status(400).json({
      error: "Invalid launch ID",
    });
  }

  const abortedLaunch = await launchesModel.abortLaunchByID(launchID);
  if (!abortedLaunch) {
    return res.status(404).json({
      error: "Launch ID not found",
    });
  }

  return res.status(200).json(abortedLaunch);
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
};
