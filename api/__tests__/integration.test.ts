import { Battle, Team, User } from "@prisma/client";
import request from "supertest";
import { prisma } from "../prisma/prisma";
import server from "../src";
import { redis } from "../src/services/redis.service";
import { team } from "./utils/constant";
import { createUserForTest } from "./utils/createUserForTest";

let userToken = "";
let secondUser: User;
let secondUserToken = "";
let teamCreated: Team;
let secondTeamCreated: Team;
let battleId = 0;
let battle: Battle;

beforeAll(async () => {
  try {
    await prisma.battle.deleteMany();
    await prisma.team.deleteMany();
    await prisma.friend.deleteMany();

    const users = await createUserForTest(2);
    userToken = users[0].token;
    secondUser = users[1].user;
    secondUserToken = users[1].token;
  } catch (error) {
    console.error("Error in beforeAll:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    server.close();
    redis.quit();
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
});

describe("Complete integration test", () => {
  it("Creates a team", async () => {
    const response = await request(server)
      .post("/api/team")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        name: "test create",
        team: team,
      });
    teamCreated = response.body;
    expect(response.status).toBe(200);
  });

  it("Adds a friend", async () => {
    const response = await request(server)
      .post("/api/friend/add")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendId: secondUser.id,
      });

    expect(response.status).toBe(200);
  });

  it("Creates a second team for battle", async () => {
    const response = await request(server)
      .post("/api/team")
      .set("Cookie", `auth_token=${secondUserToken}`)
      .send({
        name: "Opponent Team",
        team: team,
      });
    secondTeamCreated = response.body;
    expect(response.status).toBe(200);
  });

  it("Starts a battle", async () => {
    const response = await request(server)
      .post("/api/battle/start")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        attackerTeamId: teamCreated.id,
        defenderTeamId: secondTeamCreated.id,
      });

    battleId = response.body.id;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Get battle", async () => {
    const response = await request(server)
      .get(`/api/battle/${battleId}`)
      .set("Cookie", `auth_token=${userToken}`);

    battle = response.body;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("Attacks during the battle", async () => {
    const response = await request(server)
      .post(`/api/battle/attack`)
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        id: battleId,
        by: "ATTACKER",
        type: "ATTACK",
        from: {
          hp: 45,
          hp_base: 45,
          id: 1,
          img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
          name: "bulbasaur",
          attack: 49,
          img_back:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
          types: ["grass", "poison"],
        },
        to: {
          hp: 39,
          hp_base: 39,
          id: 4,
          img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
          name: "charmander",
          attack: 52,
          img_back:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
          types: ["fire"],
        },
        strengthType: ["fire"],
        weakType: ["grass"],
      });

    expect(response.status).toBe(200);
  });
});
