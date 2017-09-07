-- Table for holding info of unverified app users.

DROP TABLE UnverifiedAppUser CASCADE;
CREATE TABLE IF NOT EXISTS UnverifiedAppUser
(
	appUserKey INTEGER PRIMARY KEY REFERENCES AppUser (appUserKey)
);

ALTER TABLE UnverifiedAppUser ADD COLUMN IF NOT EXISTS verificationToken    CHAR(20)    NOT NULL;
-- Cleanup entries that are expired (over 3 days old).
ALTER TABLE UnverifiedAppUser ADD COLUMN IF NOT EXISTS expireDate           TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '3' DAY;
