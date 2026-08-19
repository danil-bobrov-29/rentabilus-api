CREATE TABLE "user_employments" (
    "userId" UUID NOT NULL,
    "position" TEXT,
    "taxRate" DECIMAL(5,2),
    "salary" DECIMAL(14,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_employments_pkey" PRIMARY KEY ("userId")
);

INSERT INTO "user_employments" ("userId", "position", "updatedAt")
SELECT "id", "position", CURRENT_TIMESTAMP
FROM "users"
WHERE "position" IS NOT NULL;

ALTER TABLE "users" DROP COLUMN "position";

ALTER TABLE "user_employments"
ADD CONSTRAINT "user_employments_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
