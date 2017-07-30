
SELECT dropFunction('claimFoodListing');
CREATE OR REPLACE FUNCTION claimFoodListing
(
     _foodListingKey         INTEGER        DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
     _requestedByAppUserKey     INTEGER        DEFAULT NULL    -- This is the key we shall use to claim a listing

)
RETURNS VOID
AS $$

BEGIN
    UPDATE FoodListing
    SET requestedByAppUserKey = _requestedByAppUserKey
    WHERE _foodListingKey = foodListingKey;
END;
$$ LANGUAGE plpgsql;

SELECT claimFoodListing(1, 1);