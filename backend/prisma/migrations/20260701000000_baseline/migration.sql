-- Add the new role values introduced after the initial schema.
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'LODGE_REVIEWER';
ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'LODGE_ADMIN';

-- Add optimistic locking for progress mutations introduced after the initial schema.
ALTER TABLE "passport_progress"
ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 0;
