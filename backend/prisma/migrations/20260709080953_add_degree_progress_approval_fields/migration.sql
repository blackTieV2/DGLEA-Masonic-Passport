-- AlterTable
ALTER TABLE "degree_progress" ADD COLUMN     "approval_notes" TEXT,
ADD COLUMN     "reopened_at" TIMESTAMP(3),
ADD COLUMN     "reopened_by" UUID,
ADD COLUMN     "submitted_at" TIMESTAMP(3),
ADD COLUMN     "submitted_by" UUID;
