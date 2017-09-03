-- Table for holding basic Contact Info.
--DROP TABLE ContactInfo CASCADE;
CREATE TABLE IF NOT EXISTS ContactInfo
(
    contactInfoKey SERIAL PRIMARY KEY
);

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS appUserKey         INTEGER         NOT NULL UNIQUE REFERENCES AppUser (appUserKey);
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS address            VARCHAR(128)    NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS addressLatitude    NUMERIC(7, 4)   NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS addressLongitude   NUMERIC(7, 4)   NOT NULL;

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS city               VARCHAR(60)     NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS state              CHAR(2)         NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS zip                INTEGER         NOT NULL;

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS phone              CHAR(12)        NOT NULL;


CREATE INDEX IF NOT EXISTS contactInfo_AddressLatitudeIdx   ON ContactInfo (addressLatitude);
CREATE INDEX IF NOT EXISTS contactInfo_AddressLongitudeIdx  ON ContactInfo (addressLongitude);
