PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`project_id` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_entries`("id", "title", "completed", "created_at", "project_id") SELECT "id", "title", "completed", "created_at", "project_id" FROM `entries`;--> statement-breakpoint
DROP TABLE `entries`;--> statement-breakpoint
ALTER TABLE `__new_entries` RENAME TO `entries`;--> statement-breakpoint
PRAGMA foreign_keys=ON;