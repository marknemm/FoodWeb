
DROP TABLE FoodListingFoodTypeMap CASCADE;
CREATE TABLE IF NOT EXISTS FoodListingFoodTypeMap
(
    FoodListingFoodTypeMapKey SERIAL PRIMARY KEY
);

ALTER TABLE FoodListingFoodTypeMap ADD COLUMN IF NOT EXISTS foodListingKey          INTEGER     REFERENCES FoodListing(foodListingKey);
ALTER TABLE FoodListingFoodTypeMap ADD COLUMN IF NOT EXISTS foodTypeKey             INTEGER     REFERENCES FoodType(foodTypeKey);

CREATE INDEX IF NOT EXISTS foodListingKeyInfoIdx ON FoodListingFoodTypeMap (foodListingKey);
CREATE INDEX IF NOT EXISTS foodTypeKeyInfoIdx    ON FoodListingFoodTypeMap (foodTypeKey);
