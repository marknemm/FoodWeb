-- Donor table for holding basic Donor info.
CREATE TABLE IF NOT EXISTS Donor
(
    donorKey SERIAL PRIMARY KEY
);

ALTER TABLE Donor ADD COLUMN IF NOT EXISTS donorOrganization VARCHAR(128);

CREATE INDEX IF NOT EXISTS donorOrganizationIdx ON Donor (donorOrganization);
