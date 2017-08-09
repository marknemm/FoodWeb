-- Table for holding basic Organization Info.


--DROP TABLE Organization CASCADE;
CREATE TABLE IF NOT EXISTS Organization
(
    organizationKey SERIAL PRIMARY KEY
);

ALTER TABLE Organization ADD COLUMN IF NOT EXISTS name              VARCHAR(128)    NOT NULL;
ALTER TABLE Organization ADD COLUMN IF NOT EXISTS contactInfoKey    INTEGER         REFERENCES ContactInfo (contactInfoKey);


CREATE INDEX IF NOT EXISTS organizationInfoNameIdx ON OrganizationInfo (name);
