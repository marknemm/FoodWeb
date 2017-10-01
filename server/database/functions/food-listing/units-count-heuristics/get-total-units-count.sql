/**
 * Gets the count of total units for a given Food Listing.
 */
SELECT dropFunction('getTotalUnitsCount');
CREATE OR REPLACE FUNCTION getTotalUnitsCount
(
     _foodListingKey INTEGER
)
RETURNS INTEGER -- The count of total units for a given Food Listing.
AS $$

    -- Calculate the number of total parts for the given Food Listing.
    SELECT      availableUnitsCount + COALESCE(CAST(SUM(claimedUnitsCount) AS INTEGER), 0)
    FROM        FoodListing
    LEFT JOIN   ClaimedFoodListing ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
    WHERE       FoodListing.foodListingKey = _foodListingKey
    GROUP BY    FoodListing.foodListingKey, availableUnitsCount;

$$ LANGUAGE sql;
