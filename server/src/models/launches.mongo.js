const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    default: true,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
    required: true,
  },
});
const launchesModel = mongoose.model("Launch", launchesSchema);
const DEFAULT_FLIGHT_NUMBER = 0;
const DEFAULT_PROJECTION = { _id: 0, __v: 0 };
const DEFAULT_PAGE = 0;
const DEFAULT_LIMIT = 10;

async function storeLaunch(launch) {
  try {
    const filter = {
      flightNumber: launch.flightNumber,
    };
    const options = {
      upsert: true,
    };
    await launchesModel.findOneAndUpdate(filter, launch, options);
  } catch (error) {
    console.log(error);
  }
}

async function addNewLaunch(newLaunch) {
  const flightNumber = (await getLastestFlightNumber()) + 1;
  newLaunch.flightNumber = flightNumber;
  await storeLaunch(newLaunch);
}

async function isExist(launch) {
  return (await launchesModel.exists(launch)) !== null;
}

async function getAllLaunches(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
  page = isNaN(page) ? DEFAULT_PAGE : page;
  limit = isNaN(limit) ? DEFAULT_LIMIT : limit;
  const filter = {
    flightNumber: { $gt: page * limit },
  };
  return await launchesModel.find(filter, DEFAULT_PROJECTION).limit(limit);
}

async function getLaunchByID(id) {
  const filter = {
    flightNumber: id,
  };
  return await launchesModel.findOne(filter, DEFAULT_PROJECTION);
}

async function getLastestLaunch() {
  return await launchesModel.findOne().sort("-flightNumber");
}

async function getLastestFlightNumber() {
  const lastestFlight = await getLastestLaunch();
  return lastestFlight ? lastestFlight.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function abortLaunchByID(id) {
  const filter = {
    flightNumber: id,
  };
  const update = {
    upcoming: false,
    success: false,
  };
  const options = {
    new: true,
  };
  launchesModel.findOneAndUpdate();
  const abortedLaunch = await launchesModel
    .findOneAndUpdate(filter, update, options)
    .select(DEFAULT_PROJECTION);

  return abortedLaunch;
}

module.exports = {
  addNewLaunch,
  isExist,
  getAllLaunches,
  getLaunchByID,
  getLastestLaunch,
  abortLaunchByID,
};
