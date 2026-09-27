import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar,
  	"name" varchar,
  	"email" varchar,
  	"message" varchar,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "messages_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "emails_notify_email" varchar DEFAULT 'marlina_serd@yahoo.com';
  ALTER TABLE "site_settings" ADD COLUMN "emails_notify_on_subscribe" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "emails_send_welcome" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "emails_welcome_subject" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "emails_welcome_message" varchar;
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "messages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "messages" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_messages_fk";
  
  DROP INDEX "payload_locked_documents_rels_messages_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "messages_id";
  ALTER TABLE "site_settings" DROP COLUMN "emails_notify_email";
  ALTER TABLE "site_settings" DROP COLUMN "emails_notify_on_subscribe";
  ALTER TABLE "site_settings" DROP COLUMN "emails_send_welcome";
  ALTER TABLE "site_settings" DROP COLUMN "emails_welcome_subject";
  ALTER TABLE "site_settings" DROP COLUMN "emails_welcome_message";`)
}
