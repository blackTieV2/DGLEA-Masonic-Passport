-- CreateEnum
CREATE TYPE "degree_type" AS ENUM ('ENTERED_APPRENTICE', 'FELLOW_CRAFT', 'MASTER_MASON', 'ROYAL_ARCH_PREPARATION');

-- CreateEnum
CREATE TYPE "degree_status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'READY_FOR_SIGN_OFF', 'SIGNED_OFF');

-- DropForeignKey
ALTER TABLE "brother_profiles" DROP CONSTRAINT "brother_profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_assignments" DROP CONSTRAINT "mentor_assignments_brother_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_assignments" DROP CONSTRAINT "mentor_assignments_mentor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mentor_sessions" DROP CONSTRAINT "mentor_sessions_brother_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "milestone_templates" DROP CONSTRAINT "milestone_templates_section_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "passport_progress" DROP CONSTRAINT "passport_progress_brother_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "passport_sections" DROP CONSTRAINT "passport_sections_template_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_progress_id_fkey";

-- DropForeignKey
ALTER TABLE "ritual_performances" DROP CONSTRAINT "ritual_performances_brother_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "role_assignments" DROP CONSTRAINT "role_assignments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "section_signoffs" DROP CONSTRAINT "section_signoffs_brother_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "visitations" DROP CONSTRAINT "visitations_brother_profile_id_fkey";

-- AlterTable
ALTER TABLE "brother_profiles" ADD COLUMN     "email" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferred_name" TEXT;

-- CreateTable
CREATE TABLE "lodge_profiles" (
    "id" UUID NOT NULL,
    "lodge_name" TEXT NOT NULL,
    "lodge_number" TEXT NOT NULL,
    "district" TEXT,
    "meeting_location" TEXT,
    "secretary_contact" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lodge_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "degree_progress" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "degree_type" "degree_type" NOT NULL,
    "status" "degree_status" NOT NULL DEFAULT 'NOT_STARTED',
    "mentor_notes" TEXT,
    "approved_by" UUID,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "degree_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lodge_profiles_lodge_number_key" ON "lodge_profiles"("lodge_number");

-- CreateIndex
CREATE INDEX "degree_progress_brother_profile_id_idx" ON "degree_progress"("brother_profile_id");

-- CreateIndex
CREATE INDEX "degree_progress_degree_type_idx" ON "degree_progress"("degree_type");

-- CreateIndex
CREATE UNIQUE INDEX "degree_progress_brother_profile_id_degree_type_key" ON "degree_progress"("brother_profile_id", "degree_type");

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brother_profiles" ADD CONSTRAINT "brother_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "degree_progress" ADD CONSTRAINT "degree_progress_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_mentor_user_id_fkey" FOREIGN KEY ("mentor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_sections" ADD CONSTRAINT "passport_sections_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "passport_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_templates" ADD CONSTRAINT "milestone_templates_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "passport_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_progress" ADD CONSTRAINT "passport_progress_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "passport_progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_sessions" ADD CONSTRAINT "mentor_sessions_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitations" ADD CONSTRAINT "visitations_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ritual_performances" ADD CONSTRAINT "ritual_performances_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_signoffs" ADD CONSTRAINT "section_signoffs_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
