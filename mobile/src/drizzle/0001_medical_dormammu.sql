ALTER TABLE `notes` ADD `pinned` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `position`;