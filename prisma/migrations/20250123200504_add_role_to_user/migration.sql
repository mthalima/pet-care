/*
  Warnings:

  - You are about to drop the column `breed` on the `pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pet` DROP COLUMN `breed`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('PET_OWNER', 'CARETAKER') NOT NULL DEFAULT 'PET_OWNER';
