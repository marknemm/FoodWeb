-- Table for holding info of unverified app users.

CREATE TABLE IF NOT EXISTS UnverifiedAppUser
(
	appUserKey INTEGER PRIMARY KEY REFERENCES AppUser (appUserKey)
);

ALTER TABLE UnverifiedAppUser ADD COLUMN IF NOT EXISTS token  CHAR(20) NOT NULL;

