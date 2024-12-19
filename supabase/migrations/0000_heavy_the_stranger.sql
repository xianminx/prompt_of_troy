CREATE TABLE "battles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" integer NOT NULL,
	"attacker_id" text NOT NULL,
	"defender_id" text NOT NULL,
	"attack_prompt_id" text NOT NULL,
	"defend_prompt_id" text NOT NULL,
	"status" text NOT NULL,
	"winner" text,
	"secret" text NOT NULL,
	"rating_changes" json,
	"error" text,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"rating" integer DEFAULT 1000 NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"draws" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" text PRIMARY KEY NOT NULL,
	"code_name" text NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_attacker_id_players_id_fk" FOREIGN KEY ("attacker_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_defender_id_players_id_fk" FOREIGN KEY ("defender_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_attack_prompt_id_prompts_id_fk" FOREIGN KEY ("attack_prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "battles" ADD CONSTRAINT "battles_defend_prompt_id_prompts_id_fk" FOREIGN KEY ("defend_prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;