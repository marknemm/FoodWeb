/**
 * Gets the count of units that the Donor still has posession of (both available and claimed, but not delivery state) for a given Food Listing.
 */
SELECT dropFunction('getDonorOnHandUnitsCount');
CREATE OR REPLACE FUNCTION getDonorOnHandUnitsCount
(
     _foodListingKey INTEGER
)
RETURNS INTEGER -- The count of donor on hand units for a given Food Listing.
AS $$

    -- Calculate the number of donor on hand units for the given Food Listing.
    SELECT      availableUnitsCount + COALESCE(CAST(SUM(claimedUnitsCount) AS INTEGER), 0)
    FROM        FoodListing
    LEFT JOIN   ClaimedFoodListing ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
    WHERE       FoodListing.foodListingKey = _foodListingKey
      AND       NOT EXISTS (
                    SELECT 1 FROM   DeliveryFoodListing
                    WHERE           DeliveryFoodListing.claimedFoodListingKey = ClaimedFoodListing.claimedFoodListingKey
                )
    GROUP BY    FoodListing.foodListingKey, FoodListing.availableUnitsCount;

$$ LANGUAGE sql;
