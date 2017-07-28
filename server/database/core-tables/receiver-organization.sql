-- Receiver table for holding Receiver Organizations.
CREATE TABLE IF NOT EXISTS ReceiverOrganization
(
    receiverOrganizationKey SERIAL PRIMARY KEY
);

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS organizationInfoKey   INTEGER    REFERENCES OrganizationInfo (organizationInfoKey);

CREATE INDEX IF NOT EXISTS receiverOrganizationInfoIdx ON ReceiverOrganization (organizationInfoKey);