-- USER table for basic application info such as login and contact data.
--DROP TABLE AppUser CASCADE;
CREATE TABLE IF NOT EXISTS AppUser
(
    appUserKey SERIAL PRIMARY KEY
);

--A unique username for every user. This, along with the email shall be the primary identifiers
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS username               VARCHAR(128)    NOT NULL UNIQUE; 

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS email                  VARCHAR(128)    NOT NULL UNIQUE;

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserPasswordKey     INTEGER         REFERENCES AppUserPassword(appUserPasswordKey);

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS lastName               VARCHAR(60)     NOT NULL;

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS firstName              VARCHAR(60)     NOT NULL;

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS createDate             TIMESTAMP       DEFAULT CURRENT_TIMESTAMP;

-- Flag to determine if the user has confirmed their signup/registration via link sent in email.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS singupConfirmed        BOOLEAN         DEFAULT FALSE;

-- Next three entries relate to disabling a user for violation of terms of use.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabled               BOOLEAN         DEFAULT FALSE;

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabledDate           TIMESTAMP       DEFAULT NULL;

ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabledReason         TEXT            DEFAULT NULL;


CREATE UNIQUE INDEX IF NOT EXISTS appUser_UsernameIdx           ON AppUser (username);

CREATE UNIQUE INDEX IF NOT EXISTS appUser_EmailIdx              ON AppUser (email);

CREATE UNIQUE INDEX IF NOT EXISTS appUser_AppUserPasswordKeyIdx ON AppUser (appUserPasswordKey);

-- Index for quick sorting and searching by full name.
CREATE INDEX IF NOT EXISTS appUser_FullNameIdx                  ON AppUser (lastName, firstName);
