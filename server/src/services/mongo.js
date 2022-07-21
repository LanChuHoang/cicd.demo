const mongoose = require("mongoose");

async function connectMongo() {
  mongoose.connection.once("open", () => {
    console.log("Mongo DB Connected");
  });
  mongoose.connection.on("Error", (err) => {
    console.log(err);
  });

  const MONGO_URL = process.env.MONGO_URL;
  mongoose.connect(MONGO_URL);
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo,
};
