-- Food Listings table for holding record of all food that Donors have posted.
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

-- Foreign Key to FoodType table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodTypeKey        INTEGER NOT NULL REFERENCES FoodType (foodTypeKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable         BOOLEAN NOT NULL;

-- Foreign Key to AppUser table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByAppUserKey INTEGER NOT NULL REFERENCES AppUser (appUserKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription    TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl             TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS expireDate         TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate           TIMESTAMP;

-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodTypeKey);

CREATE INDEX IF NOT EXISTS expireDateIdx ON FoodListing (expireDate);

-- Create more indexes here --
