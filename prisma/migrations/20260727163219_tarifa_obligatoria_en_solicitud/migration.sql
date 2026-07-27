/*
  Warnings:

  - Made the column `tarifa_id` on table `solicitudes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "solicitudes" ALTER COLUMN "tarifa_id" SET NOT NULL;
