ALTER TABLE `game_results` ADD `run_key` text;--> statement-breakpoint
CREATE UNIQUE INDEX `game_results_run_key_unique` ON `game_results` (`run_key`);