-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "rawPayload" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);
