
SELECT dropFunction('claimFoodListing');
CREATE OR REPLACE FUNCTION claimFoodListing
(
     _foodListingKey        INTEGER     DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
     _claimedByAppUserKey   INTEGER     DEFAULT NULL    -- This is the key of the user who is claiming the Food Listing.
)
RETURNS INTEGER -- The claimedFoodListing primary key.
AS $$
    DECLARE _claimedFoodListingKey  INTEGER;
BEGIN

    -- The constraints on included insert columns will ensure that the AppUser and FoodListing exist.
    INSERT INTO ClaimedFoodListing (claimedByAppUserKey, foodListingKey)
    VALUES (_claimedByAppUserKey, _foodListingKey)
    RETURNING ClaimedFoodListing.claimedFoodListingKey INTO _claimedFoodListingKey;

    RETURN _claimedFoodListingKey;

END;
$$ LANGUAGE plpgsql;

--SELECT claimFoodListing(1, 1);