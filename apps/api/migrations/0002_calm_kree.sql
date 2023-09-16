CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`status` text NOT NULL,
	`assigned_user_id` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `timelines` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`creator_id` text,
	`data` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customers_primary_index` ON `customers` (`workspace_id`,`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `customers_assigned_user_index` ON `customers` (`assigned_user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`workspace_id`,`email`);--> statement-breakpoint
CREATE INDEX `timelines_primary_index` ON `timelines` (`customer_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `timelines_creator_index` ON `timelines` (`creator_id`);