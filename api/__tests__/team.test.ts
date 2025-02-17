import { PrismaClient, Team } from "@prisma/client";
import { sign } from "hono/jwt";
import request from "supertest";
import server from "../src";
import { redis } from "../src/services/redis.service";
import { saveSession } from "../src/services/session.service";
import { team } from "./utils/constant";

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "";
const SESSION_EXPIRY = 60 * 10;

let sessionId = "";
let token = "";
let teamCreated = {} as Team;

beforeAll(async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.team.deleteMany();

    //create user for test team
    const user = await prisma.user.create({
      data: {
        username: "team",
        email: "team@test.com",
        code: 111111,
        passwordSalt: "123456",
        passwordHash: "123456",
      },
    });

    //generate session team
    sessionId = crypto.randomUUID();
    await saveSession(
      sessionId,
      { userId: user.id, email: user.email },
      SESSION_EXPIRY
    );

    //generate token team
    token = await sign(
      { sessionId, exp: Math.floor(Date.now() / 1000) + 60 * 10 },
      SECRET_KEY,
      "HS256"
    );
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    server.close();
    redis.quit();
  } catch (error) {
    console.error("Erreur:", error);
  }
});

describe("Team Tests", () => {
  it("Test get all is 404", async () => {
    //not team created before
    const response = await request(server)
      .get("/api/team/all")
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Teams not found");
  });

  it("Test create team is 200", async () => {
    const response = await request(server)
      .post("/api/team")
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "test create",
        team: team,
      });
    teamCreated = response.body;
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("test create");
    expect(response.body.pokemons).toEqual(team);
  });

  it("Test create team is 400", async () => {
    const response = await request(server)
      .post("/api/team")
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "test",
        team: team.slice(0, 3), //size team not correct
      });
    expect(response.status).toBe(400);
  });

  it("Test update team is 200", async () => {
    const response = await request(server)
      .put(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${token}`)
      .send({
        name: "test update",
        team: team,
      });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("test update");
    expect(response.body.pokemons).toEqual(team);
  });

  it("Test get all is 200", async () => {
    const response = await request(server)
      .get("/api/team/all")
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("Test get team by id is 200", async () => {
    const response = await request(server)
      .get(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("test update");
    expect(response.body.pokemons).toEqual(team);
  });

  it("Test get team by id is 404", async () => {
    const response = await request(server)
      .get(`/api/team/${0}`)
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Team not found");
  });

  it("Test delete team is 200", async () => {
    const response = await request(server)
      .delete(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team has correctly deleted");
  });

  it("Test delete team is 200", async () => {
    //team already deleted
    const response = await request(server)
      .delete(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${token}`);

    expect(response.status).toBe(500);
  });
});
