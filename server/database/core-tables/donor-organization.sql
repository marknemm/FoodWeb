-- Donor table for holding Donor Organizations.
CREATE TABLE IF NOT EXISTS DonorOrganization
(
    donorOrganizationKey SERIAL PRIMARY KEY
);

ALTER TABLE DonorOrganization ADD COLUMN IF NOT EXISTS organizationInfoKey   INTEGER    REFERENCES OrganizationInfo (organizationInfoKey);

CREATE INDEX IF NOT EXISTS donorOrganizationInfoIdx ON DonorOrganization (organizationInfoKey);