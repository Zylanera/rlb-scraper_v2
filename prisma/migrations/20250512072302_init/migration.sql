/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `scrapedAt` on the `Product` table. All the data in the column will be lost.
  - Added the required column `bild` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strecke` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variante` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Bank" (
    "blz" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bankBlz" TEXT NOT NULL,
    CONSTRAINT "Branch_bankBlz_fkey" FOREIGN KEY ("bankBlz") REFERENCES "Bank" ("blz") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "laufzeit" TEXT NOT NULL,
    "zinssatz" REAL NOT NULL,
    "variante" TEXT NOT NULL,
    "bild" BOOLEAN NOT NULL,
    "strecke" TEXT NOT NULL,
    "branchId" INTEGER NOT NULL,
    CONSTRAINT "Product_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("id", "laufzeit", "zinssatz") SELECT "id", "laufzeit", "zinssatz" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
