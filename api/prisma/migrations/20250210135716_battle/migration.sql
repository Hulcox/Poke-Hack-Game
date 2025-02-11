-- CreateEnum
CREATE TYPE "BattleStatus" AS ENUM ('ONGOING', 'WIN', 'LOOSE');

-- AlterTable
ALTER TABLE "Battle" ADD COLUMN     "status" "BattleStatus" NOT NULL DEFAULT 'ONGOING';
