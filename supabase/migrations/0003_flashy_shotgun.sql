ALTER TABLE "battles" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "rating" SET DEFAULT 1200;--> statement-breakpoint
ALTER TABLE "players" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "rating" integer DEFAULT 1200 NOT NULL;--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;