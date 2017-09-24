/**
 * Claims (units/parts of) a Food Listing.
 */
SELECT dropFunction('claimFoodListing');
CREATE OR REPLACE FUNCTION claimFoodListing
(
     _foodListingKey        INTEGER,                    -- This is the key of the Food Listing that is being claimed.
     _claimedByAppUserKey   INTEGER,                    -- This is the key of the user who is claiming the Food Listing.
     _unitsCount            INTEGER     DEFAULT NULL    -- The number of units/parts that are to be claimed.
                                                        -- NOTE: Null is interpreted as * all available units *!
)
RETURNS INTEGER -- The claimedFoodListing primary key.
AS $$
    DECLARE _claimedFoodListingKey  INTEGER;
BEGIN

    -- TODO: Need to perform an edit check that ensures that the FoodListing and AppUser exist!!!
    -- TODO: Need to create a trigger that ensures we are not claiming more parts than what is available!!!!

    -- If the given units count to claim is NULL, then we are to claim all available units!
    IF (_unitsCount IS NULL)
    THEN
        _unitsCount := (SELECT getAvailableUnitsCount(_foodListingKey));
    END IF;

    -- The constraints on included insert columns will ensure that the AppUser and FoodListing exist.
    INSERT INTO ClaimedFoodListing (claimedByAppUserKey, foodListingKey, claimedUnitsCount)
    VALUES      (_claimedByAppUserKey, _foodListingKey, _unitsCount)
    RETURNING   ClaimedFoodListing.claimedFoodListingKey
    INTO        _claimedFoodListingKey;

    RETURN _claimedFoodListingKey;

END;
$$ LANGUAGE plpgsql;


SELECT * FROM ClaimedFoodListing;
SELECT * FROM claimFoodListing(1, 1, 4);
SELECT * FROM claimFoodListing(1, 2, 6);
SELECT * FROM ClaimedFoodListing;

