const express = require("express");
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const router = express.Router();

router.use("/launches", launchesRouter);
router.use("/planets", planetsRouter);

module.exports = router;
