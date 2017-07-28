-- Food Listings table for holding record of all food that Donors have posted.
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

-- Foreign Key to FoodType table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodTypeKey            INTEGER NOT NULL REFERENCES FoodType (foodTypeKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable             BOOLEAN NOT NULL;

-- Foreign Key to AppUser table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS donorAppUserKey        INTEGER NOT NULL REFERENCES AppUser (appUserKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription        TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl                 TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS expireDate             TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate               TIMESTAMP;

-- If this is NULL, then the food listing is still posted and not part of a receiver's cart.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS receiverAppUserKey     INTEGER REFERENCES AppUser (appUserKey); 

-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodTypeKey);

CREATE INDEX IF NOT EXISTS donorAppUserKeyIdx ON FoodListing (donorAppUserKey);

CREATE INDEX IF NOT EXISTS expireDateIdx ON FoodListing (expireDate);

CREATE INDEX IF NOT EXISTS receiverAppUserKeyIdx ON FoodListing (receiverAppUserKey);

-- Create more indexes here --
