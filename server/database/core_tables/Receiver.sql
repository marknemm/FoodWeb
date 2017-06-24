-- Receiver table for holding basic Receiver info.
CREATE TABLE IF NOT EXISTS Receiver
(
    receiverKey SERIAL PRIMARY KEY
);

ALTER TABLE Receiver ADD COLUMN IF NOT EXISTS receiverOrganization VARCHAR(128);

CREATE INDEX IF NOT EXISTS receiverOrganizationIdx ON Receiver (receiverOrganization);
