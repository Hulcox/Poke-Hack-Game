import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockDeep<PrismaClient>()),
}));

const prismaMock = new PrismaClient() as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
