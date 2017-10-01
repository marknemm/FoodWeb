/**
 * Gets the count of units that have been claimed by a given user for a given Food Listing.
 */
SELECT dropFunction('getUserClaimedUnitsCount');
CREATE OR REPLACE FUNCTION getUserClaimedUnitsCount
(
     _foodListingKey        INTEGER,
     _claimedByAppUserKey   INTEGER
)
RETURNS INTEGER -- The count of claimed units for a given User and Food Listing.
AS $$

    -- Calculate the number of claimed parts.
    SELECT      COALESCE(claimedUnitsCount, 0)
    FROM        FoodListing
    LEFT JOIN   ClaimedFoodListing ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
                                  AND ClaimedFoodListing.claimedByAppUserKey = _claimedByAppUserKey
    WHERE       FoodListing.foodListingKey = _foodListingKey;

$$ LANGUAGE sql;
