import { Team } from "@prisma/client";
import request from "supertest";
import { prisma } from "../prisma/prisma";
import server from "../src";
import { redis } from "../src/services/redis.service";
import { team } from "./utils/constant";
import { createUserForTest } from "./utils/createUserForTest";

let userToken = "";
let teamCreated = {} as Team;

beforeAll(async () => {
  try {
    await prisma.team.deleteMany();

    //create user for test team
    const users = await createUserForTest();
    userToken = users[0].token;
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

describe("Team Tests", () => {
  it("Test get all is 404", async () => {
    //not team created before
    const response = await request(server)
      .get("/api/team/all")
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Teams not found");
  });

  it("Test create team is 200", async () => {
    const response = await request(server)
      .post("/api/team")
      .set("Cookie", `auth_token=${userToken}`)
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
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        name: "test",
        team: team.slice(0, 3), //size team not correct
      });
    expect(response.status).toBe(400);
  });

  it("Test update team is 200", async () => {
    const response = await request(server)
      .put(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${userToken}`)
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
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("Test get team by id is 200", async () => {
    const response = await request(server)
      .get(`/api/team/${teamCreated.id}`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("test update");
    expect(response.body.pokemons).toEqual(team);
  });

  it("Test get team by id is 404", async () => {
    const response = await request(server)
      .get(`/api/team/${0}`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Team not found");
  });

  // it("Test delete team is 200", async () => {
  //   const response = await request(server)
  //     .delete(`/api/team/${teamCreated.id}`)
  //     .set("Cookie", `auth_token=${userToken}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe("Team has correctly deleted");
  // });

  // it("Test delete team is 200", async () => {
  //   //team already deleted
  //   const response = await request(server)
  //     .delete(`/api/team/${teamCreated.id}`)
  //     .set("Cookie", `auth_token=${userToken}`);

  //   expect(response.status).toBe(500);
  // });
});
