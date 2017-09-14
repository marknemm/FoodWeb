-- Holds availability (schedule) data for each user. Determines when each user is available for pickup (donor) and/or delivery (receiver).

--DROP TABLE AppUserAvailability CASCADE;
CREATE TABLE IF NOT EXISTS AppUserAvailability
(
    appUserAvailabilityKey SERIAL PRIMARY KEY
);

-- Many to one relationship between AppUserAvailability and AppUser respectively.
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS appUserKey     INTEGER     NOT NULL REFERENCES AppUser (appUserKey);

-- Number signifying the day of the week (Sunday => 1 ... Saturday => 7).
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS weekday        INTEGER     NOT NULL;
-- The start and end of a contiguous time block of availability.
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS startTime      TIME        NOT NULL;
ALTER TABLE AppUserAvailability ADD COLUMN IF NOT EXISTS endTime        TIME        NOT NULL;


CREATE INDEX IF NOT EXISTS appUserAvailability_appUserKeyIdx ON AppUserAvailability (appUserKey);
CREATE INDEX IF NOT EXISTS appUserAvailability_timeRange ON AppUserAvailability (weekday, startTime, endTime);
