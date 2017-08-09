-- USER table for basic application info such as login and contact data.
--DROP TABLE AppUser CASCADE;
CREATE TABLE IF NOT EXISTS AppUser
(
    appUserKey SERIAL PRIMARY KEY
);

-- Unique Email address.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS email                      VARCHAR(128)    NOT NULL UNIQUE;

-- Password must be encrypted when entered into this table!
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserPasswordKey         INTEGER         REFERENCES AppUserPassword(appUserPasswordKey);

--A unique username for every user. This, along with the email shall be the primary identifiers
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS username                   VARCHAR(128)    NOT NULL UNIQUE; 

-- The App User's Last Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS lastName                   VARCHAR(60)     NOT NULL;

-- The App User's First Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS firstName                  VARCHAR(60)     NOT NULL;

-- Index on username.
CREATE UNIQUE INDEX IF NOT EXISTS appUserUsernameIdx ON AppUser (username);

-- Index on email.
CREATE UNIQUE INDEX IF NOT EXISTS appUserEmailIdx ON AppUser (email);

-- Index for quick sorting and searching by full name.
CREATE INDEX IF NOT EXISTS appUserFullNameIdx ON AppUser (lastName, firstName);
