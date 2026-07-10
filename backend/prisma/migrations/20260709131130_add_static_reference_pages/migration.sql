-- CreateEnum
CREATE TYPE "reference_section" AS ENUM ('INTRODUCTION', 'PROFILE', 'EMERGENCY', 'CONDUCT', 'FEES', 'BRETHREN', 'ENTERED_APPRENTICE', 'FELLOW_CRAFT', 'MASTER_MASON', 'ROYAL_ARCH', 'CONSOLIDATION', 'OFFICER_JEWELS', 'ODES');

-- CreateTable
CREATE TABLE "static_reference_pages" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "section" "reference_section" NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "content_markdown" TEXT,
    "source_edition" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "static_reference_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "static_reference_pages_slug_key" ON "static_reference_pages"("slug");

-- CreateIndex
CREATE INDEX "static_reference_pages_section_idx" ON "static_reference_pages"("section");

-- CreateIndex
CREATE INDEX "static_reference_pages_order_index_idx" ON "static_reference_pages"("order_index");
