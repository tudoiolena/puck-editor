/*
  Warnings:

  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."pages" DROP CONSTRAINT "pages_user_id_fkey";

-- DropTable
DROP TABLE "public"."pages";

-- CreateTable
CREATE TABLE "forms" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "puck_content" JSONB NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" SERIAL NOT NULL,
    "form_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "submission_data" JSONB NOT NULL,
    "ip_address" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forms_slug_key" ON "forms"("slug");

-- CreateIndex
CREATE INDEX "forms_user_id_idx" ON "forms"("user_id");

-- CreateIndex
CREATE INDEX "forms_slug_idx" ON "forms"("slug");

-- CreateIndex
CREATE INDEX "forms_is_published_idx" ON "forms"("is_published");

-- CreateIndex
CREATE INDEX "form_submissions_form_id_idx" ON "form_submissions"("form_id");

-- CreateIndex
CREATE INDEX "form_submissions_email_idx" ON "form_submissions"("email");

-- CreateIndex
CREATE INDEX "form_submissions_submitted_at_idx" ON "form_submissions"("submitted_at");

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "forms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
