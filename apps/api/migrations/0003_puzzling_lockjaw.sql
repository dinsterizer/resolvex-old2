DROP INDEX IF EXISTS `timelines_creator_index`;--> statement-breakpoint
ALTER TABLE customers ADD `updated_at` integer NOT NULL;--> statement-breakpoint
CREATE INDEX `timelines_secondary_index` ON `timelines` (`creator_id`,`created_at`);