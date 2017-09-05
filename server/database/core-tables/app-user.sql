-- USER table for basic application info such as login and contact data.
DROP TABLE AppUser CASCADE;
CREATE TABLE IF NOT EXISTS AppUser
(
    appUserKey SERIAL PRIMARY KEY
);

-- The email is the username and primary identifier for an account.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS email                  VARCHAR(128)    NOT NULL UNIQUE; -- UNIQUE automatically adds index!

-- In the case of the AppUser being an Organization, this will refer to the administrator of the organization.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS lastName               VARCHAR(60)     NOT NULL;
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS firstName              VARCHAR(60)     NOT NULL;

-- Date that the AppUser was created.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS createDate             TIMESTAMP       DEFAULT CURRENT_TIMESTAMP;

-- Flag to determine if the user has confirmed their signup/registration via link sent in email if individual or via other methods if organization.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS singupConfirmed        BOOLEAN         DEFAULT FALSE;

-- Next three entries relate to disabling a user for violation of terms of use.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabled               BOOLEAN         DEFAULT FALSE;
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabledDate           TIMESTAMP       DEFAULT NULL;
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS disabledReason         TEXT            DEFAULT NULL;

-- Flags that determine how this AppUser can function.
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS isDonor                BOOLEAN         NOT NULL;
ALTER TABLE AppUser ADD COLUMN IF NOT EXISTS isReceiver             BOOLEAN         NOT NULL;


CREATE INDEX IF NOT EXISTS appUser_fullNameIdx ON AppUser (lastName, firstName);
