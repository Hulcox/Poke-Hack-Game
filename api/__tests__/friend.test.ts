import { Friend, User } from "@prisma/client";
import request from "supertest";
import { prisma } from "../prisma/prisma";
import server from "../src";
import { redis } from "../src/services/redis.service";
import { createUserForTest } from "./utils/createUserForTest";

let userToken = "";
let friendUser: User;
let friend: Friend;

beforeAll(async () => {
  try {
    await prisma.friend.deleteMany();

    //create user for test friend
    const users = await createUserForTest(2);
    userToken = users[0].token;
    friendUser = users[1].user;
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

describe("Friend Tests", () => {
  it("Test get all is 404", async () => {
    //not friend created before
    const response = await request(server)
      .get("/api/friend/all")
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Friends not found");
  });

  it("Test add friend is 200", async () => {
    const response = await request(server)
      .post("/api/friend/add")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendId: friendUser.id,
      });

    friend = response.body;

    expect(response.status).toBe(200);
  });

  it("Test add friend all ready exist", async () => {
    const response = await request(server)
      .post("/api/friend/add")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendId: friendUser.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("This friend link already exist");
  });

  it("Test add friend is 400", async () => {
    const response = await request(server)
      .post("/api/friend/add")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendId: 0,
      });

    expect(response.status).toBe(400);
  });

  it("Test get all is 200", async () => {
    const response = await request(server)
      .get("/api/friend/all")
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("Test accept friend is 200", async () => {
    const response = await request(server)
      .put("/api/friend/accept")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendLinkid: friend.id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });

  it("Test friend all ready accepted is 500", async () => {
    const response = await request(server)
      .put("/api/friend/accept")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendLinkid: friend.id,
      });

    expect(response.status).toBe(500);
  });

  it("Test accept friend is 400", async () => {
    const response = await request(server)
      .put("/api/friend/accept")
      .set("Cookie", `auth_token=${userToken}`)
      .send({
        friendLinkid: 0,
      });

    expect(response.status).toBe(400);
  });

  it("Test delete friend is 200", async () => {
    const response = await request(server)
      .delete(`/api/friend/${friend.id}`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(200);
  });

  it("Test delete friend is 500", async () => {
    const response = await request(server)
      .delete(`/api/friend/${0}`)
      .set("Cookie", `auth_token=${userToken}`);

    expect(response.status).toBe(500);
  });
});
