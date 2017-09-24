-- Food Listings table for holding record of all food that Donors have posted.

--DROP TABLE FoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

--The Posted by key refers to the app user organization map key
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS donatedByAppUserKey            INTEGER         NOT NULL REFERENCES AppUser (appUserKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodTitle                      VARCHAR(100)    NOT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription                TEXT            DEFAULT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl                         TEXT            DEFAULT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable                     BOOLEAN         NOT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate                       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS availableUntilDate             TIMESTAMP       NOT NULL;

-- Totoal number of parts of a Food Listing (e.g. 12 cans, 3 5lb bags, etc).
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS totalUnitsCount                INTEGER         NOT NULL DEFAULT 1;

-- Number of parts of Food Listing that Receivers are free to Claim (Not Claimed yet).
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS availableUnitsCount            INTEGER         NOT NULL;

-- Number of parts of Food Listing that the Donor still has control over (these food items should not be marked for delivery).
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS donorUnitsOnHandCount          INTEGER         NOT NULL;

-- The units label used to designate the type of each part (e.g. cans, bottles, etc).
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS unitsLabel                     TEXT            DEFAULT NULL;

-- Contains the total weight of the entire Food Listing in pounds.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS totalWeight                    INTEGER         DEFAULT NULL;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListing_DonatedByIdx         ON FoodListing (donatedByAppUserKey, donorUnitsOnHandCount);

CREATE INDEX IF NOT EXISTS foodListing_availableUntilDate   ON FoodListing (availableUntilDate);

CREATE INDEX IF NOT EXISTS foodListing_availableUnitsCount  ON FoodListing (availableUnitsCount);

-- Create more indexes here --

-- Create triggers --
DROP TRIGGER IF EXISTS foodListing_availableUnitsCountUpdate ON FoodListing;
CREATE TRIGGER foodListing_availableUnitsCountUpdate
    BEFORE UPDATE OF availableUnitsCount ON FoodListing
    FOR EACH ROW EXECUTE PROCEDURE beforeAvailableUnitsCountUpdate();
