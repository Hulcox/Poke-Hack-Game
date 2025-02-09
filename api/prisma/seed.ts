import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";

const prisma = new PrismaClient();

export const hashPassword = (
  password: string,
  salt = randomBytes(1000).toString("hex")
): [salt: string, hash: string] => {
  const passwordHash = pbkdf2Sync(password, salt, 100000, 16, "sha512");
  return [passwordHash.toString("hex"), salt];
};

async function main() {
  console.log("Seeding database...");

  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.friend.deleteMany();

  const users = [];
  for (let i = 0; i < 10; i++) {
    const [passwordHash, passwordSalt] = hashPassword("test123");
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
        code: faker.number.int({ min: 100000, max: 999999 }),
      },
    });
    users.push(user);
  }

  for (const user of users) {
    await prisma.team.create({
      data: {
        userId: user.id,
        name: faker.word.noun(),
        pokemonIds: ["1", "4", "7", "110", "53", "32"],
        totalHp: faker.number.int({ min: 100, max: 500 }),
      },
    });
  }

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      if (Math.random() > 0.5) {
        await prisma.friend.create({
          data: {
            userId: users[i].id,
            friendId: users[j].id,
            status: Math.random() > 0.5 ? "ACCEPTED" : "PENDING",
          },
        });
      }
    }
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
