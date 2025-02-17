import request from "supertest";
import server from "../src";
import { redis } from "../src/services/redis.service";
import { createUserForTest } from "./utils/createUserForTest";

let userToken = "";

beforeAll(async () => {
  try {
    //create user for test weather
    const [token] = await createUserForTest();
    userToken = token;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    server.close();
    redis.quit();
  } catch (error) {
    console.error("Erreur:", error);
  }
});

describe("Team Tests", () => {
  it("Test get weather is 200", async () => {
    const response = await request(server)
      .get(`/api/weather?lat=${40}&lon=${40}`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it("Test get weather is 404", async () => {
    const response = await request(server)
      .get(`/api/weather`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(400);
  });
});
