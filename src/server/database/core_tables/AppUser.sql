-- USER table for basic application info such as login and contact data.
CREATE TABLE IF NOT EXISTS AppUser
(
    appUserKey SERIAL PRIMARY KEY
);

-- Email will be the username also.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserEmail           VARCHAR(128);

-- Password must be encrypted when entered into this table!
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserPassword        TEXT            NOT NULL;

-- The App User's Last Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserLastName        VARCHAR(60)     NOT NULL;

-- The App User's First Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS appUserFirstName       VARCHAR(60)     NOT NULL;

-- Foreign key to the Donor table.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS donorKey               INTEGER         REFERENCES Donor (donorKey);

-- Foreign key to the Receiver table.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS receiverKey            INTEGER         REFERENCES Receiver (receiverKey);


-- Index for quick sorting and searching.
CREATE INDEX IF NOT EXISTS appUserFullNameIdx ON AppUser (appUserLastName, appUserFirstName);
