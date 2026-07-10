-- CreateEnum
CREATE TYPE "role" AS ENUM ('BROTHER', 'PERSONAL_MENTOR', 'LODGE_MENTOR', 'WM_LODGE_LEADERSHIP', 'DISTRICT_MENTOR', 'DISTRICT_ADMIN', 'SYSTEM_ADMIN', 'LODGE_MEMBERSHIP_OFFICER');

-- CreateEnum
CREATE TYPE "stage" AS ENUM ('ENTERED_APPRENTICE', 'FELLOW_CRAFT', 'MASTER_MASON', 'PREPARING_FOR_OFFICE');

-- CreateEnum
CREATE TYPE "progress_status" AS ENUM ('LOCKED', 'NOT_STARTED', 'DRAFT', 'SUBMITTED', 'CLARIFICATION_REQUESTED', 'VERIFIED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "review_decision" AS ENUM ('VERIFY', 'REJECT', 'REQUEST_CLARIFICATION');

-- CreateEnum
CREATE TYPE "scope_type" AS ENUM ('GLOBAL', 'DISTRICT', 'LODGE', 'BROTHER');

-- CreateEnum
CREATE TYPE "assignment_type" AS ENUM ('PERSONAL_MENTOR', 'LODGE_MENTOR');

-- CreateEnum
CREATE TYPE "audit_action" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'SUBMIT', 'REVIEW', 'ASSIGN_ROLE', 'REVOKE_ROLE', 'STAGE_TRANSITION', 'EXPORT', 'DELETE', 'BREAK_GLASS_ACCESS', 'PERMISSION_DENIED');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('ITEM_SUBMITTED', 'ITEM_VERIFIED', 'ITEM_REJECTED', 'CLARIFICATION_REQUESTED', 'CLARIFICATION_RESPONDED', 'STAGE_TRANSITION');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firebase_uid" TEXT,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferred_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lodges" (
    "id" UUID NOT NULL,
    "district_id" UUID NOT NULL,
    "lodge_name" TEXT NOT NULL,
    "lodge_number" TEXT NOT NULL,
    "meeting_location" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lodges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_assignments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "role" NOT NULL,
    "scope_type" "scope_type" NOT NULL,
    "scope_id" UUID,
    "active_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brother_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lodge_id" UUID NOT NULL,
    "current_stage" "stage" NOT NULL,
    "date_initiated" TIMESTAMP(3),
    "date_passed" TIMESTAMP(3),
    "date_raised" TIMESTAMP(3),
    "solomon_registered_on" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brother_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_assignments" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "mentor_user_id" UUID NOT NULL,
    "assignment_type" "assignment_type" NOT NULL,
    "active_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passport_templates" (
    "id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "source_reference" TEXT,
    "active_from" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passport_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passport_sections" (
    "id" UUID NOT NULL,
    "template_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "unlock_stage" "stage" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passport_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "milestone_templates" (
    "id" UUID NOT NULL,
    "section_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "requires_review" BOOLEAN NOT NULL DEFAULT true,
    "target_count" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "milestone_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passport_progress" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "milestone_template_id" UUID NOT NULL,
    "status" "progress_status" NOT NULL,
    "draft_note" TEXT,
    "submitted_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passport_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "progress_id" UUID NOT NULL,
    "reviewer_user_id" UUID NOT NULL,
    "decision" "review_decision" NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_sessions" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "mentor_user_id" UUID NOT NULL,
    "section_code" TEXT NOT NULL,
    "session_date" TIMESTAMP(3) NOT NULL,
    "topics_summary" TEXT NOT NULL,
    "next_actions" TEXT,
    "is_private_note" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitations" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "section_code" TEXT NOT NULL,
    "lodge_visited" TEXT NOT NULL,
    "visit_date" TIMESTAMP(3) NOT NULL,
    "degree_observed" TEXT,
    "debrief_completed" BOOLEAN NOT NULL DEFAULT false,
    "reflection" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ritual_performances" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "section_code" TEXT NOT NULL,
    "ritual_date" TIMESTAMP(3) NOT NULL,
    "ritual_label" TEXT NOT NULL,
    "verified_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ritual_performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_signoffs" (
    "id" UUID NOT NULL,
    "brother_profile_id" UUID NOT NULL,
    "section_code" TEXT NOT NULL,
    "signed_by" UUID NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL,
    "outcome" TEXT NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "section_signoffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "notification_type" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "related_resource_type" TEXT,
    "related_resource_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" "audit_action" NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" UUID,
    "scope" TEXT,
    "metadata_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_firebase_uid_idx" ON "users"("firebase_uid");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lodges_lodge_number_key" ON "lodges"("lodge_number");

-- CreateIndex
CREATE INDEX "lodges_district_id_idx" ON "lodges"("district_id");

-- CreateIndex
CREATE INDEX "role_assignments_user_id_idx" ON "role_assignments"("user_id");

-- CreateIndex
CREATE INDEX "role_assignments_role_idx" ON "role_assignments"("role");

-- CreateIndex
CREATE INDEX "role_assignments_scope_type_scope_id_idx" ON "role_assignments"("scope_type", "scope_id");

-- CreateIndex
CREATE UNIQUE INDEX "brother_profiles_user_id_key" ON "brother_profiles"("user_id");

-- CreateIndex
CREATE INDEX "brother_profiles_lodge_id_idx" ON "brother_profiles"("lodge_id");

-- CreateIndex
CREATE INDEX "brother_profiles_current_stage_idx" ON "brother_profiles"("current_stage");

-- CreateIndex
CREATE INDEX "mentor_assignments_brother_profile_id_idx" ON "mentor_assignments"("brother_profile_id");

-- CreateIndex
CREATE INDEX "mentor_assignments_mentor_user_id_idx" ON "mentor_assignments"("mentor_user_id");

-- CreateIndex
CREATE INDEX "passport_sections_template_id_idx" ON "passport_sections"("template_id");

-- CreateIndex
CREATE INDEX "passport_sections_code_idx" ON "passport_sections"("code");

-- CreateIndex
CREATE INDEX "milestone_templates_section_id_idx" ON "milestone_templates"("section_id");

-- CreateIndex
CREATE INDEX "passport_progress_brother_profile_id_idx" ON "passport_progress"("brother_profile_id");

-- CreateIndex
CREATE INDEX "passport_progress_milestone_template_id_idx" ON "passport_progress"("milestone_template_id");

-- CreateIndex
CREATE INDEX "passport_progress_status_idx" ON "passport_progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "passport_progress_brother_profile_id_milestone_template_id_key" ON "passport_progress"("brother_profile_id", "milestone_template_id");

-- CreateIndex
CREATE INDEX "reviews_progress_id_idx" ON "reviews"("progress_id");

-- CreateIndex
CREATE INDEX "reviews_reviewer_user_id_idx" ON "reviews"("reviewer_user_id");

-- CreateIndex
CREATE INDEX "mentor_sessions_brother_profile_id_idx" ON "mentor_sessions"("brother_profile_id");

-- CreateIndex
CREATE INDEX "mentor_sessions_mentor_user_id_idx" ON "mentor_sessions"("mentor_user_id");

-- CreateIndex
CREATE INDEX "visitations_brother_profile_id_idx" ON "visitations"("brother_profile_id");

-- CreateIndex
CREATE INDEX "ritual_performances_brother_profile_id_idx" ON "ritual_performances"("brother_profile_id");

-- CreateIndex
CREATE INDEX "section_signoffs_brother_profile_id_idx" ON "section_signoffs"("brother_profile_id");

-- CreateIndex
CREATE INDEX "section_signoffs_section_code_idx" ON "section_signoffs"("section_code");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "audit_events_action_idx" ON "audit_events"("action");

-- CreateIndex
CREATE INDEX "audit_events_resource_type_idx" ON "audit_events"("resource_type");

-- CreateIndex
CREATE INDEX "audit_events_actor_user_id_idx" ON "audit_events"("actor_user_id");

-- CreateIndex
CREATE INDEX "audit_events_created_at_idx" ON "audit_events"("created_at");

-- AddForeignKey
ALTER TABLE "lodges" ADD CONSTRAINT "lodges_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brother_profiles" ADD CONSTRAINT "brother_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brother_profiles" ADD CONSTRAINT "brother_profiles_lodge_id_fkey" FOREIGN KEY ("lodge_id") REFERENCES "lodges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_assignments" ADD CONSTRAINT "mentor_assignments_mentor_user_id_fkey" FOREIGN KEY ("mentor_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_sections" ADD CONSTRAINT "passport_sections_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "passport_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone_templates" ADD CONSTRAINT "milestone_templates_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "passport_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_progress" ADD CONSTRAINT "passport_progress_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passport_progress" ADD CONSTRAINT "passport_progress_milestone_template_id_fkey" FOREIGN KEY ("milestone_template_id") REFERENCES "milestone_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "passport_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_user_id_fkey" FOREIGN KEY ("reviewer_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_sessions" ADD CONSTRAINT "mentor_sessions_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_sessions" ADD CONSTRAINT "mentor_sessions_mentor_user_id_fkey" FOREIGN KEY ("mentor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitations" ADD CONSTRAINT "visitations_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ritual_performances" ADD CONSTRAINT "ritual_performances_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_signoffs" ADD CONSTRAINT "section_signoffs_brother_profile_id_fkey" FOREIGN KEY ("brother_profile_id") REFERENCES "brother_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
