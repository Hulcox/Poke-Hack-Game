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

const team = [
  {
    hp: 45,
    id: 1,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    name: "bulbasaur",
    attack: 49,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
    types: ["grass", "poison"],
  },
  {
    hp: 60,
    id: 2,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    name: "ivysaur",
    attack: 62,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png",
    types: ["grass", "poison"],
  },
  {
    hp: 80,
    id: 3,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    name: "venusaur",
    attack: 82,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png",
    types: ["grass", "poison"],
  },
  {
    hp: 39,
    id: 4,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    name: "charmander",
    attack: 52,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
    types: ["fire"],
  },
  {
    hp: 58,
    id: 5,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
    name: "charmeleon",
    attack: 64,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png",
    types: ["fire"],
  },
  {
    hp: 78,
    id: 6,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    name: "charizard",
    attack: 84,
    img_back:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png",
    types: ["fire", "flying"],
  },
];

async function main() {
  console.log("Seeding database...");

  const [passwordHash, passwordSalt] = hashPassword("123456");
  await prisma.user.create({
    data: {
      email: "test@test.com",
      username: "Hulcox",
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      code: 111111,
    },
  });

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
        pokemons: team,
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
