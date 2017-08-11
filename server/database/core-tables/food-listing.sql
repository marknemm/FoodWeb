-- Food Listings table for holding record of all food that Donors have posted.
--DROP TABLE FoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

-- Foreign Key to FoodType table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodTypeKey            INTEGER NOT NULL REFERENCES FoodType (foodTypeKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable             BOOLEAN NOT NULL;

--The Posted by key refers to the app user organization map key
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByKey            INTEGER NOT NULL REFERENCES AppUserOrganizationMap (AppUserOrganizationMapKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription        TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl                 TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS expireDate             TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate               TIMESTAMP;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodTypeKey);

CREATE INDEX IF NOT EXISTS postedByKeyIdx ON FoodListing (postedByKey);

CREATE INDEX IF NOT EXISTS expireDateIdx ON FoodListing (expireDate);

-- Create more indexes here --
