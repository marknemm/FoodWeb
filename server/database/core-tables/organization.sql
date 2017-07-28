-- Table for holding basic Organization Info.
CREATE TABLE IF NOT EXISTS OrganizationInfo
(
    organizationInfoKey SERIAL PRIMARY KEY
);

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS name        VARCHAR(128)    NOT NULL;

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS address     VARCHAR(128)    NOT NULL;

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS city        VARCHAR(60)     NOT NULL;

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS state       CHAR(2)         NOT NULL;

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS zip         INTEGER         NOT NULL;

ALTER TABLE OrganizationInfo ADD COLUMN IF NOT EXISTS phone       CHAR(12)        NOT NULL;

CREATE INDEX IF NOT EXISTS organizationInfoNameIdx ON OrganizationInfo (name);
