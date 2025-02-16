-- CreateTable
CREATE TABLE "Hack" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "solution" TEXT NOT NULL,

    CONSTRAINT "Hack_pkey" PRIMARY KEY ("id")
);
