-- CreateTable
CREATE TABLE "Battle" (
    "id" SERIAL NOT NULL,
    "attackerId" INTEGER NOT NULL,
    "attackerTeamId" INTEGER NOT NULL,
    "defenderId" INTEGER NOT NULL,
    "defenderTeamId" INTEGER NOT NULL,
    "movesHistory" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "weakTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "strengthTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weather" TEXT NOT NULL,
    "weatherIcon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_attackerId_fkey" FOREIGN KEY ("attackerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_defenderId_fkey" FOREIGN KEY ("defenderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_attackerTeamId_fkey" FOREIGN KEY ("attackerTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_defenderTeamId_fkey" FOREIGN KEY ("defenderTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
