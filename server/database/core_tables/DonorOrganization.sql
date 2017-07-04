-- Donor table for holding basic Donor (organization) info.
CREATE TABLE IF NOT EXISTS DonorOrganization
(
    donorOrganizationKey SERIAL PRIMARY KEY
);

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS name     VARCHAR(128)    NOT NULL;

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS address  VARCHAR(128)    NOT NULL;

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS city     VARCHAR(60)     NOT NULL;

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS state    CHAR(2)         NOT NULL;

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS zip      INTEGER         NOT NULL;

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS phone    CHAR(12)        NOT NULL;

CREATE INDEX IF NOT EXISTS donorOrganizationNameIdx ON DonorOrganization (name);
