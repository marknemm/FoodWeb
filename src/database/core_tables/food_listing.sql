-- Food Listings table for holding record of all food that Donors have posted.
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodType           INTEGER NOT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable         BOOLEAN NOT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByAppUserKey INTEGER NOT NULL;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription    TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl             TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate           TIMESTAMP;

-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodType);

-- Create more indexes here --
