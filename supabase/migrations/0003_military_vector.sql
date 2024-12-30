ALTER TABLE "players" ALTER COLUMN "rating" SET DEFAULT 1200;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "rating" integer DEFAULT 1200 NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "updated_at" timestamp NOT NULL;