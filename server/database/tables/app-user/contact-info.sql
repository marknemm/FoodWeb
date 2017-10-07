-- Table for holding basic Contact Info.

--DROP TABLE ContactInfo CASCADE;
CREATE TABLE IF NOT EXISTS ContactInfo
(
    contactInfoKey SERIAL PRIMARY KEY
);

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS appUserKey         INTEGER         NOT NULL UNIQUE REFERENCES AppUser (appUserKey);

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS address            VARCHAR(128)    NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS city               VARCHAR(60)     NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS state              CHAR(2)         NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS zip                INTEGER         NOT NULL;
ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS gpsCoordinate      GEOGRAPHY       NOT NULL;

ALTER TABLE ContactInfo ADD COLUMN IF NOT EXISTS phone              CHAR(12)        NOT NULL;


-- Index for quick street address lookup.
CREATE INDEX IF NOT EXISTS contactInfo_AddressIdx   ON ContactInfo (state, zip, address);

-- Special GIST index for geometric points which is part of PostgreGIS extension.
CREATE INDEX IF NOT EXISTS contactInfo_GPSCoordinateIdx ON ContactInfo USING GIST (gpsCoordinate);
VACUUM ANALYZE ContactInfo (gpsCoordinate); -- TODO: Research this... collects statistics on index...
