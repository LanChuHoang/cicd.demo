const request = require("supertest");
const app = require("../../app");
const { connectMongo, disconnectMongo } = require("../../services/mongo");
require("dotenv").config();

describe("Lauches API Test", () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  // 1. Create a group of test case for GET /lauches endpoint
  describe("Test GET /launches - Get all launches", () => {
    // 1.1 GET all lauches
    test("Test Success case", (done) => {
      request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  // 2. Create POST /launches test group
  describe("Test POST /launches - Post a new launch", () => {
    const completeLaunchData = {
      launchDate: "March 3, 2033",
      mission: "Test Misson",
      rocket: "Test Rocket",
      target: "Test Target",
    };

    const launchWithoutDate = {
      mission: "Test Misson",
      rocket: "Test Rocket",
      target: "Test Target",
    };

    const launchWithInvalidDate = {
      launchDate: "Invalid Date",
      mission: "Test Misson",
      rocket: "Test Rocket",
      target: "Test Target",
    };

    test("Test Success case", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const reponseDate = new Date(response.body.launchDate).valueOf();
      const expectedDate = new Date(completeLaunchData.launchDate).valueOf();
      expect(reponseDate).toBe(expectedDate);
      expect(response.body).toMatchObject(launchWithoutDate);
    });

    test("Test Failure case: Catch missing property", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required properties of a launch",
      });
    });

    test("Test Failure case: Catch invalid date", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
