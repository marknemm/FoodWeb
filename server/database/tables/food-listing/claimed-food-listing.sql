
--DROP TABLE ClaimedFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS ClaimedFoodListing
(
    claimedFoodListingKey SERIAL PRIMARY KEY
);

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedByAppUserKey INTEGER NOT NULL REFERENCES AppUser (appUserKey);
ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS foodListingKey      INTEGER NOT NULL REFERENCES FoodListing (foodListingKey);

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedDate         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS claimedFoodListing_ClaimedByAppUserKey   ON ClaimedFoodListing (claimedByAppUserKey);
CREATE INDEX IF NOT EXISTS claimedFoodListing_FoodListingKey        ON ClaimedFoodListing (foodListingKey);
