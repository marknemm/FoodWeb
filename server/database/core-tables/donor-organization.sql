-- Donor table for holding Donor Organizations.
--DROP TABLE DonorOrganization CASCADE;
CREATE TABLE IF NOT EXISTS DonorOrganization
(
    donorOrganizationKey SERIAL PRIMARY KEY
);

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS organizationKey   INTEGER    REFERENCES Organization (organizationKey);

CREATE INDEX IF NOT EXISTS donorOrganizationInfoIdx ON DonorOrganization (organizationKey);