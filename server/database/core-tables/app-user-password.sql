--Table to store everything related directly to the PASSWORD

--DROP TABLE AppUserPassword CASCADE;
CREATE TABLE IF NOT EXISTS AppUserPassword
(
    appUserPasswordKey SERIAL PRIMARY KEY
);

ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS password       CHAR(60)    NOT NULL;
ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS lastModDate    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP;
-- The expiration date for the password will be by default 60 days after the creation date.
ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS expireDate     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP + INTERVAL '60' DAY;

CREATE INDEX IF NOT EXISTS appUserKeyInfoIdx ON AppUserOrganizationMap (appUserKey);