--Table to store everything related directly to the PASSWORD

DROP TABLE AppUserPassword CASCADE;
CREATE TABLE IF NOT EXISTS AppUserPassword
(
    appUserPasswordKey SERIAL PRIMARY KEY
);

-- No unique constraint on appUserKey since we will hold records of all previous passwords for given user.
-- This could potentially be useful in cases where account is claimed to have been stolen.
ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS appUserKey     INTEGER     NOT NULL REFERENCES AppUser (appUserKey);
ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS password       CHAR(60)    NOT NULL;
ALTER TABLE AppUserPassword ADD COLUMN IF NOT EXISTS createDate     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP;
