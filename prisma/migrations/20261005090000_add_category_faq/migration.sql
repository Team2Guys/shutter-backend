-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "faq" JSONB[] DEFAULT ARRAY[]::JSONB[];
