CREATE TABLE `seisans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`legacy_hash` text,
	`data` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `seisans_name_unique` ON `seisans` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `seisans_legacy_hash_unique` ON `seisans` (`legacy_hash`);