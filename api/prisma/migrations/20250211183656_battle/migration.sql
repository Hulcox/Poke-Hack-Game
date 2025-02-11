/*
  Warnings:

  - You are about to drop the column `strengthTypes` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `weakTypes` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `weather` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `weatherIcon` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "strengthTypes",
DROP COLUMN "weakTypes",
DROP COLUMN "weather",
DROP COLUMN "weatherIcon";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;
