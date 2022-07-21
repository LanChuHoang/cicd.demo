const axios = require("axios").default;
const API_BASE_URL = "https://api.spacexdata.com/v4/launches";

async function getLastestLaunch() {
  const URL = `${API_BASE_URL}/query`;
  const query = {
    query: {},
    options: {
      sort: "-date_local",
      limit: 1,
      select: "flight_number name date_local rocket payloads success upcoming",
      populate: [
        {
          path: "rocket",
          select: "name",
        },
        {
          path: "payloads",
          select: "customers",
        },
      ],
    },
  };
  try {
    const response = await axios.post(URL, query);
    return response.data.docs[0];
  } catch (error) {
    console.log(error);
  }
}

async function getLaunches() {
  const URL = `${API_BASE_URL}/query`;
  const data = {
    query: {
      date_local: {
        $gte: "2006-01-01T00:00:00-00:00",
      },
    },
    options: {
      pagination: false,
      sort: "flightNumber",
      select: "flight_number name date_local rocket payloads success upcoming",
      populate: [
        {
          path: "rocket",
          select: "name",
        },
        {
          path: "payloads",
          select: "customers",
        },
      ],
    },
  };
  try {
    const response = await axios.post(URL, data);
    const launches = response.data.docs.map((launchData) => {
      const customers = launchData.payloads.flatMap((pl) => pl.customers);
      console.log();
      const launch = {
        flightNumber: launchData.flight_number,
        mission: launchData.name,
        launchDate: new Date(launchData.date_local),
        rocket: launchData.rocket.name,
        target: null,
        customers: customers,
        upcoming: launchData.upcoming,
        success: launchData.success,
      };
      return launch;
    });
    return launches;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getLastestLaunch,
  getLaunches,
};
