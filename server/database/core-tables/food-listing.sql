-- Food Listings table for holding record of all food that Donors have posted.
--DROP TABLE FoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS FoodListing
(
    foodListingKey SERIAL PRIMARY KEY
);

-- Foreign Key to FoodType table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodTypeKey            INTEGER NOT NULL REFERENCES FoodType (foodTypeKey);

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS perishable             BOOLEAN NOT NULL;

<<<<<<< HEAD
--The Posted by key refers to the app user organization map key
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByKey            INTEGER NOT NULL REFERENCES AppUserOrganizationMap (AppUserOrganizationMapKey);
=======
-- Foreign Key to AppUser table.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postedByAppUserKey     INTEGER NOT NULL REFERENCES AppUser (appUserKey);
>>>>>>> 34173cfc36546d75802144df0dcdfa8c24f071e3

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS foodDescription        TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS imgUrl                 TEXT;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS expireDate             TIMESTAMP;

ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS postDate               TIMESTAMP;

<<<<<<< HEAD
=======
-- If this is NULL, then the food listing is still posted and not part of a receiver's cart.
ALTER TABLE FoodListing ADD COLUMN IF NOT EXISTS requestedByAppUserKey  INTEGER REFERENCES AppUser (appUserKey);
>>>>>>> 34173cfc36546d75802144df0dcdfa8c24f071e3

-- Add more columns here --

CREATE INDEX IF NOT EXISTS foodListingFoodTypeIdx ON FoodListing (foodTypeKey);

CREATE INDEX IF NOT EXISTS postedByKeyIdx ON FoodListing (postedByKey);

CREATE INDEX IF NOT EXISTS expireDateIdx ON FoodListing (expireDate);

-- Create more indexes here --
