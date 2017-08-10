
--DROP TABLE ClaimedFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS ClaimedFoodListing
(
    claimedFoodListingKey SERIAL PRIMARY KEY
);

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedByKey       INTEGER REFERENCES AppUserOrganizationMap (AppUserOrganizationMapKey);
ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS foodListingKey     INTEGER REFERENCES FoodListing (foodListingKey); 

CREATE INDEX IF NOT EXISTS claimedByKeyIdx ON ClaimedFoodListing (claimedByKey);
