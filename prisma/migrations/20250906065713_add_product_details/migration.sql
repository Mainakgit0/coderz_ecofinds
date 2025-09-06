-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "brand" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'Good',
    "size" TEXT,
    "color" TEXT,
    "material" TEXT,
    "yearPurchased" INTEGER,
    "location" TEXT,
    "weight" TEXT,
    "dimensions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Available',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "products_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_products" ("category", "createdAt", "description", "id", "imageUrl", "ownerId", "price", "status", "title", "updatedAt") SELECT "category", "createdAt", "description", "id", "imageUrl", "ownerId", "price", "status", "title", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
