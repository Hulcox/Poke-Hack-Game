import type { Context } from "hono";
import { prisma } from "../../prisma/prisma.js";
import { type AddFriend, type UpdateFriend } from "../types/friend.types.js";
import {
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_REQUEST_BODY,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
  STATUS_CODE_NOT_FOUND,
} from "../utils/constants.js";
import { friendSchema } from "../utils/schema.js";

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
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static getAllFriendsForBattle = async (c: Context) => {
    const { userId } = c.get("user");

    try {
      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            { userId: userId, friend: { teams: { some: {} } } },
            { friendId: userId, user: { teams: { some: {} } } },
          ],
        },
        include: {
          user: {
            omit: { passwordHash: true, passwordSalt: true },
            include: { teams: true },
          },
          friend: {
            omit: { passwordHash: true, passwordSalt: true },
            include: { teams: true },
          },
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
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static addFriend = async (c: Context) => {
    const { userId } = c.get("user");
    try {
      const { friendId } = await c.req.json<AddFriend>();

      const validate = friendSchema.safeParse({ friendId });

      if (!validate.success) {
        return c.json(ERROR_INVALID_REQUEST_BODY, STATUS_CODE_BAD_REQUEST);
      }

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
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };

  static acceptFriend = async (c: Context) => {
    try {
      const { friendLinkid } = await c.req.json<UpdateFriend>();

      const validate = friendSchema.safeParse({ friendId: friendLinkid });

      if (!validate.success) {
        return c.json(ERROR_INVALID_REQUEST_BODY, STATUS_CODE_BAD_REQUEST);
      }

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
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
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
      return c.json(
        { error: ERROR_INTERNAL_SERVER },
        STATUS_CODE_INTERNAL_SERVER_ERROR
      );
    }
  };
}
