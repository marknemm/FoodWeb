-- Table for holding basic Organization Info.

--DROP TABLE Organization CASCADE;
CREATE TABLE IF NOT EXISTS Organization
(
    organizationKey SERIAL PRIMARY KEY
);

ALTER TABLE Organization ADD COLUMN IF NOT EXISTS appUserKey    INTEGER         NOT NULL UNIQUE REFERENCES AppUser (appUserKey);
ALTER TABLE Organization ADD COLUMN IF NOT EXISTS name          VARCHAR(128)    NOT NULL;
-- More fields will likely be added that are unique to an Organization!

CREATE INDEX IF NOT EXISTS organization_NameIdx ON Organization (name);
