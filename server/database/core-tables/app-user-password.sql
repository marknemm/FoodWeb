--Table to store everything related directly to the PASSWORD

--DROP TABLE AppUserPassword CASCADE;
CREATE TABLE IF NOT EXISTS AppUserPassword
(
    appUserPasswordKey SERIAL PRIMARY KEY
);

ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS password       CHAR(60)        NOT NULL;

CREATE INDEX IF NOT EXISTS appUserKeyInfoIdx ON AppUserOrganizationMap (appUserKey);