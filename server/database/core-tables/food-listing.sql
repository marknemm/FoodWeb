-- Food Listings table for holding record of all food that Donors have posted.
DROP TABLE FoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable                     BOOLEAN     NOT NULL;

--The Posted by key refers to the app user organization map key
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS donatedByAppUserKey            INTEGER     NOT NULL REFERENCES AppUser (appUserKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription                TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl                         TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS expireDate                     TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate                       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListing_DonatedByAppUserKeyIdx           ON FoodListing (donatedByAppUserKey);

CREATE INDEX IF NOT EXISTS foodListing_ExpireDateIdx                    ON FoodListing (expireDate);

-- Create more indexes here --
