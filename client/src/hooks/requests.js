const API_BASE_URL = "http://localhost:8000/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
  const endpoint = `${API_BASE_URL}/planets`;
  const response = await fetch(endpoint);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const endpoint = `${API_BASE_URL}/launches`;
  const response = await fetch(endpoint);
  const launches = await response.json();
  const sorted = launches.sort((a, b) => a.flightNumber - b.flightNumber);
  return sorted;
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_BASE_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return { ok: false };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_BASE_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    return { ok: false };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
