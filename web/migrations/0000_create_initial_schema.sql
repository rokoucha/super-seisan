CREATE TABLE `currencies` (
	`id` text PRIMARY KEY NOT NULL,
	`seisan_id` text NOT NULL,
	`code` text NOT NULL,
	`rate` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`seisan_id`) REFERENCES `seisans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `currencies_seisan_id_idx` ON `currencies` (`seisan_id`);--> statement-breakpoint
CREATE TABLE `item_exempts` (
	`item_id` text NOT NULL,
	`participant_id` text NOT NULL,
	PRIMARY KEY(`item_id`, `participant_id`),
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`seisan_id` text NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`payer_id` text NOT NULL,
	`price` real NOT NULL,
	`currency_id` text,
	`amount` integer NOT NULL,
	`total` real NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`seisan_id`) REFERENCES `seisans`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payer_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`currency_id`) REFERENCES `currencies`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `items_seisan_id_idx` ON `items` (`seisan_id`);--> statement-breakpoint
CREATE INDEX `items_payer_id_idx` ON `items` (`payer_id`);--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`seisan_id` text NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`seisan_id`) REFERENCES `seisans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `participants_seisan_id_idx` ON `participants` (`seisan_id`);--> statement-breakpoint
CREATE TABLE `seisans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
