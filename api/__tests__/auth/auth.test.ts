import "dotenv/config";
import request from "supertest";
import { prismaMock } from "../../singleton.js";
import server from "../../src/index.js";

let token = "";

beforeAll(async () => {
  try {
    prismaMock.user.deleteMany.mockResolvedValueOnce({ count: 0 });

    const registerRes = await request(server).post("/auth/register").send({
      username: "test",
      email: "test@test.com",
      password: "Test1234!",
    });

    expect(registerRes.status).toBe(200);

    const loginRes = await request(server)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "Test1234!" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");

    token = loginRes.body.token;
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await prismaMock.$disconnect();
    server.close();
  } catch (error) {
    console.error("Erreur:", error);
  }
});

describe("Auth Tests", () => {
  it("Test register and login", () => {
    expect(token).toBeTruthy();
  });
});
