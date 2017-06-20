-- Food Listings table for holding record of all food that Donors have posted.
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

-- Foreign Key to FoodType table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodType           INTEGER NOT NULL REFERENCES FoodType (foodTypeKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable         BOOLEAN NOT NULL;

-- Foreign Key to AppUser table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByAppUserKey INTEGER NOT NULL REFERENCES AppUser (appUserKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription    TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl             TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate           TIMESTAMP;

-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodType);

-- Create more indexes here --
