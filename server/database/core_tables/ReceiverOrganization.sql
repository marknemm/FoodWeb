-- Receiver table for holding basic Receiver Organization info.
CREATE TABLE IF NOT EXISTS ReceiverOrganization
(
    receiverOrganizationKey SERIAL PRIMARY KEY
);

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS name     VARCHAR(128)    NOT NULL;

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS address  VARCHAR(128)    NOT NULL;

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS city     VARCHAR(60)     NOT NULL;

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS state    CHAR(2)         NOT NULL;

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS zip      INTEGER         NOT NULL;

ALTER TABLE ReceiverOrganization ADD COLUMN IF NOT EXISTS phone    CHAR(12)        NOT NULL;

CREATE INDEX IF NOT EXISTS receiverOrganizationNameIdx ON ReceiverOrganization (name);
