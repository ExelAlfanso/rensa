CREATE TYPE "public"."bug_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."bug_status" AS ENUM('new', 'investigating', 'acknowledged', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'responded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"bookmark_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "bookmarks_photo_id_user_id_unique" UNIQUE("photo_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "bug_reports" (
	"bug_report_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"email" text NOT NULL,
	"description" text NOT NULL,
	"steps" text,
	"expected_behavior" text,
	"actual_behavior" text,
	"browser" text,
	"attachments" text,
	"severity" "bug_severity" DEFAULT 'medium',
	"status" "bug_status" DEFAULT 'new',
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"comment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid,
	"user_id" uuid,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"contact_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"status" "contact_status" DEFAULT 'new',
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "photo_metadata" (
	"photo_metadata_id" uuid PRIMARY KEY NOT NULL,
	"width" integer,
	"height" integer,
	"format" text,
	"size" integer,
	"uploaded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"photo_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"style" text,
	"color" text,
	"camera" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roll_photos" (
	"roll_id" uuid,
	"photo_id" uuid,
	CONSTRAINT "roll_photos_roll_id_photo_id_pk" PRIMARY KEY("roll_id","photo_id")
);
--> statement-breakpoint
CREATE TABLE "rolls" (
	"roll_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"role" "user_role" DEFAULT 'user',
	"verified" boolean DEFAULT false,
	"password_changed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_photo_id_photos_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_photo_id_photos_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_metadata" ADD CONSTRAINT "photo_metadata_photo_metadata_id_photos_photo_id_fk" FOREIGN KEY ("photo_metadata_id") REFERENCES "public"."photos"("photo_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roll_photos" ADD CONSTRAINT "roll_photos_roll_id_rolls_roll_id_fk" FOREIGN KEY ("roll_id") REFERENCES "public"."rolls"("roll_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roll_photos" ADD CONSTRAINT "roll_photos_photo_id_photos_photo_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("photo_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolls" ADD CONSTRAINT "rolls_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bookmarks_photo" ON "bookmarks" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "idx_bug_reports_email" ON "bug_reports" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_comments_photo" ON "comments" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "idx_comments_user" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_contacts_email" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_photos_user" ON "photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_rolls_user" ON "rolls" USING btree ("user_id");