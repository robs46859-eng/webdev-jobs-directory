CREATE TABLE `crm_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(128),
	`lastName` varchar(128),
	`companyName` varchar(256),
	`jobTitle` varchar(256),
	`website` varchar(512),
	`location` varchar(256),
	`linkedin` varchar(512),
	`subject1` varchar(512),
	`body1` text,
	`subject2` varchar(512),
	`body2` text,
	`subject3` varchar(512),
	`body3` text,
	`status` enum('new','step1_sent','step2_sent','step3_sent','replied','booked','unsubscribed') NOT NULL DEFAULT 'new',
	`lastContactedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `local_users`;