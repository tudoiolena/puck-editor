-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "forms_user_id_position_idx" ON "forms"("user_id", "position");
