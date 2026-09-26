import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"post_id" integer,
  	"count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_ticker_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"change" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_views_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_show" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "ticker_note" varchar;
  ALTER TABLE "page_views" ADD CONSTRAINT "page_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_ticker_items" ADD CONSTRAINT "site_settings_ticker_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "page_views_post_idx" ON "page_views" USING btree ("post_id");
  CREATE INDEX "page_views_count_idx" ON "page_views" USING btree ("count");
  CREATE INDEX "page_views_updated_at_idx" ON "page_views" USING btree ("updated_at");
  CREATE INDEX "page_views_created_at_idx" ON "page_views" USING btree ("created_at");
  CREATE INDEX "site_settings_ticker_items_order_idx" ON "site_settings_ticker_items" USING btree ("_order");
  CREATE INDEX "site_settings_ticker_items_parent_id_idx" ON "site_settings_ticker_items" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_views_fk" FOREIGN KEY ("page_views_id") REFERENCES "public"."page_views"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_page_views_id_idx" ON "payload_locked_documents_rels" USING btree ("page_views_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "page_views" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_ticker_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "page_views" CASCADE;
  DROP TABLE "site_settings_ticker_items" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_views_fk";
  
  DROP INDEX "payload_locked_documents_rels_page_views_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_views_id";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_show";
  ALTER TABLE "site_settings" DROP COLUMN "ticker_note";`)
}
