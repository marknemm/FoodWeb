
--DROP TABLE ClaimedFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS ClaimedFoodListing
(
    claimedFoodListingKey SERIAL PRIMARY KEY
);

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedByAppUserKey INTEGER NOT NULL REFERENCES AppUser (appUserKey);
ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS foodListingKey      INTEGER NOT NULL REFERENCES FoodListing (foodListingKey);

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedDate         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE ClaimedFoodListing ADD COLUMN IF NOT EXISTS claimedUnitsCount   INTEGER NOT NULL;

CREATE INDEX IF NOT EXISTS claimedFoodListing_ClaimedByAppUserKey   ON ClaimedFoodListing (claimedByAppUserKey);
CREATE INDEX IF NOT EXISTS claimedFoodListing_FoodListingKey        ON ClaimedFoodListing (foodListingKey);

-- Create triggers --

-- afterClaimedUnitsCountEdit auto recalculates FoodListing.availableFoodListing.
-- Important to perform after the insert since data integrety of availableFoodListing is checked when updated!!!
DROP TRIGGER IF EXISTS claimedFoodListing_Insert ON ClaimedFoodListing;
CREATE TRIGGER claimedFoodListing_Insert
    AFTER INSERT ON ClaimedFoodListing
    FOR EACH ROW EXECUTE PROCEDURE afterClaimedUnitsCountEdit();

DROP TRIGGER IF EXISTS claimedFoodListing_Update ON ClaimedFoodListing;
CREATE TRIGGER claimedFoodListing_Update
    AFTER UPDATE OF claimedUnitsCount ON ClaimedFoodListing
    FOR EACH ROW EXECUTE PROCEDURE afterClaimedUnitsCountEdit();

DROP TRIGGER IF EXISTS claimedFoodListing_Delete ON ClaimedFoodListing;
CREATE TRIGGER claimedFoodListing_Delete
    AFTER DELETE ON ClaimedFoodListing
    FOR EACH ROW EXECUTE PROCEDURE afterClaimedUnitsCountEdit();
