CREATE TABLE `user_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`app_theme_id` integer NOT NULL,
	`app_theme_mode` text DEFAULT 'dark' NOT NULL
);
