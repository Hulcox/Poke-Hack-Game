/*
  Warnings:

  - You are about to drop the column `pokemonIds` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "pokemonIds",
ADD COLUMN     "pokemons" JSONB[];
