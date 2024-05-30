CREATE TABLE IF NOT EXISTS "plants" (
	 "id" serial PRIMARY KEY NOT NULL,
	"name" jsonb NOT NULL,
	"user_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plants" ADD CONSTRAINT "plants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "plants_user_id_index" ON "plants" ("user_id");