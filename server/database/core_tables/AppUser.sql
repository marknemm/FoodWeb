-- USER table for basic application info such as login and contact data.
CREATE TABLE IF NOT EXISTS AppUser
(
    appUserKey SERIAL PRIMARY KEY
);

-- Unique Email address.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS email                      VARCHAR(128)    NOT NULL UNIQUE;

-- Password must be encrypted when entered into this table!
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS password                   TEXT            NOT NULL;

--A unique username for every user. This, along with the email shall be the primary identifiers
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS username                   VARCHAR(128)    NOT NULL UNIQUE; 

-- The App User's Last Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS lastName                   VARCHAR(60)     NOT NULL;

-- The App User's First Name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS firstName                  VARCHAR(60)     NOT NULL;

-- The App User's phone number.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS phone                      CHAR(12);

-- The App User's Street Address.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS address                    VARCHAR(128);

-- City name.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS city                       VARCHAR(60);

-- Zip code.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS zip                        INTEGER;

-- Two letter state abbreviation.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS state                      CHAR(2);

-- Foreign key to the Donor table.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS donorOrganizationKey       INTEGER         REFERENCES DonorOrganization (donorOrganizationKey);

-- Foreign key to the Receiver table.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS receiverOrganizationKey    INTEGER         REFERENCES ReceiverOrganization (receiverOrganizationKey);


-- Index on username.
CREATE UNIQUE INDEX IF NOT EXISTS appUserUsernameIdx ON AppUser (username);

-- Index on email.
CREATE UNIQUE INDEX IF NOT EXISTS appUserEmailIdx ON AppUser (email);

-- Index for quick sorting and searching by full name.
CREATE INDEX IF NOT EXISTS appUserFullNameIdx ON AppUser (lastName, firstName);
