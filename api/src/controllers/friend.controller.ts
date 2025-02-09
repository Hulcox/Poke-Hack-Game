import { PrismaClient } from "@prisma/client";
import type { Context } from "hono";
import { type AddFriend, type UpdateFriend } from "../types/friend.types.js";
import {
  ERROR_INVALID_REQUEST,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_NOT_FOUND,
} from "../utils/constants.js";

const prisma = new PrismaClient();

export class FriendController {
  static getAllFriends = async (c: Context) => {
    const { userId } = c.get("user");

    try {
      const friends = await prisma.friend.findMany({
        where: { OR: [{ userId: userId }, { friendId: userId }] },
        include: {
          user: { omit: { passwordHash: true, passwordSalt: true } },
          friend: { omit: { passwordHash: true, passwordSalt: true } },
        },
      });

      if (friends.length == 0) {
        return c.json({ message: "Friends not found" }, STATUS_CODE_NOT_FOUND);
      }

      const friendList = friends.map(({ user, friend, ...rest }) => {
        return {
          ...rest,
          friend: rest.friendId === userId ? user : friend,
          iDoRequest: rest.friendId === userId,
        };
      });

      return c.json(friendList);
    } catch (error) {
      return c.json({ error: ERROR_INVALID_REQUEST }, STATUS_CODE_BAD_REQUEST);
    }
  };

  static addFriend = async (c: Context) => {
    const { userId } = c.get("user");
    const { friendId } = await c.req.json<AddFriend>();
    try {
      const isExist = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { friendId: userId, userId: friendId },
          ],
        },
      });

      if (isExist) {
        return c.json(
          { error: "This friend link already exist" },
          STATUS_CODE_BAD_REQUEST
        );
      }

      const friend = await prisma.friend.create({
        data: {
          userId: userId,
          friendId: friendId,
        },
      });

      return c.json(friend);
    } catch (error) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }
  };

  static acceptFriend = async (c: Context) => {
    const { friendLinkid } = await c.req.json<UpdateFriend>();

    try {
      const friend = await prisma.friend.update({
        data: {
          status: "ACCEPTED",
        },
        where: {
          id: friendLinkid,
          status: "PENDING",
        },
      });

      return c.json(friend);
    } catch (error) {
      return c.json(
        { error: ERROR_INVALID_REQUEST_BODY },
        STATUS_CODE_BAD_REQUEST
      );
    }
  };

  static deleteFriend = async (c: Context) => {
    const friendLinkid = c.req.param("id");

    try {
      await prisma.friend.delete({
        where: { id: Number(friendLinkid) },
      });

      return c.json({ message: "Friend has correctly deleted" });
    } catch (error) {
      return c.json({ error: ERROR_INVALID_REQUEST }, STATUS_CODE_BAD_REQUEST);
    }
  };
}
