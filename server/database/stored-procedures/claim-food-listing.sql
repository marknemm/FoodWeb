
SELECT dropFunction('claimFoodListing');
CREATE OR REPLACE FUNCTION claimFoodListing
(
     _foodListingKey         INTEGER        DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
     _receiverAppUserKey     INTEGER        DEFAULT NULL    -- This is the key we shall use to claim a listing

)
RETURNS VOID
AS $$

BEGIN
    UPDATE FoodListing
    SET receiverAppUserKey = _receiverAppUserKey
    WHERE _foodListingKey = foodListingKey;

END;
$$ LANGUAGE plpgsql;