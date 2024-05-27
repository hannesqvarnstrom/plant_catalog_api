DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('GOOGLE', 'FACEBOOK');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "federated_identities" (
	"provider" "provider" NOT NULL,
	"providerId" varchar,
	"createdAt" timestamp DEFAULT now(),
	"user_id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" varchar,
	"last_log_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "federated_identities" ADD CONSTRAINT "federated_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_index" ON "users" ("email");