-- Table for holding passwordRecoveryTokens for users who have requested to reset their password.

--DROP TABLE AppUserPasswordRecovery CASCADE;
CREATE TABLE IF NOT EXISTS AppUserPasswordRecovery
(
	appUserKey INTEGER PRIMARY KEY REFERENCES AppUser (appUserKey)
);

ALTER TABLE AppUserPasswordRecovery ADD COLUMN IF NOT EXISTS passwordRecoveryToken    CHAR(20)    NOT NULL;
-- Cleanup entries that are expired (over 3 days old).
ALTER TABLE AppUserPasswordRecovery ADD COLUMN IF NOT EXISTS expireDate               TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '1' HOUR;
