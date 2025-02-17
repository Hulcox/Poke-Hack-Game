import request from "supertest";
import { prisma } from "../prisma/prisma.js";
import server from "../src/index.js";
import { redis } from "../src/services/redis.service.js";

beforeAll(async () => {
  try {
    await prisma.battle.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    server.close();
    redis.quit();
  } catch (error) {
    console.error("Error:", error);
  }
});

describe("Auth Tests", () => {
  it("Test register is 200", async () => {
    const response = await request(server).post("/api/auth/register").send({
      username: "test",
      email: "auth@test.com",
      password: "Test1234!",
    });
    expect(response.status).toBe(200);
  });

  it("Test login is 200", async () => {
    const response = await request(server)
      .post("/api/auth/login")
      .send({ email: "auth@test.com", password: "Test1234!" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("Test register is 400", async () => {
    const response = await request(server).post("/api/auth/register").send({
      username: "test",
      email: "auth@test.com",
      password: "test1", // password not have min 6 character
    });
    expect(response.status).toBe(400);
  });

  it("Test login is 400", async () => {
    const response = await request(server).post("/api/auth/register").send({
      email: "test1", // not match with email
      password: "test1",
    });
    expect(response.status).toBe(400);
  });

  it("Test register is 500", async () => {
    const response = await request(server).post("/api/auth/register").send({
      username: "test",
      email: "auth@test.com", // email unique
      password: "Test1234!",
    });
    expect(response.status).toBe(500);
  });

  it("Test login is 403", async () => {
    const response = await request(server).post("/api/auth/login").send({
      email: "auth@test.com",
      password: "Test1234678!", //password not match
    });
    expect(response.status).toBe(403);
  });
});
