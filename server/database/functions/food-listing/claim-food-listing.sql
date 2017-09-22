
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
    -- TODO: Need to perform an edit check to ensure that we are not claiming more parts than what is available!!!!

    -- If the given units count to claim is NULL, then we are to claim all available units!
    IF (_unitsCount IS NULL)
    THEN

        SELECT  availableUnitsCount
        INTO    _unitsCount
        FROM    FoodListing
        WHERE   FoodListing.foodListingKey = _foodListingKey;

    END IF;

    -- Subtract from the number of available units/parts by the amount of units being claimed.
    UPDATE  FoodListing
    SET     availableUnitsCount = (availableUnitsCount - _unitsCount)
    WHERE   FoodListing.foodListingKey = _foodListingKey;

    -- The constraints on included insert columns will ensure that the AppUser and FoodListing exist.
    INSERT INTO ClaimedFoodListing (claimedByAppUserKey, foodListingKey, claimedUnitsCount)
    VALUES      (_claimedByAppUserKey, _foodListingKey, _unitsCount)
    RETURNING   ClaimedFoodListing.claimedFoodListingKey
    INTO        _claimedFoodListingKey;

    RETURN _claimedFoodListingKey;

END;
$$ LANGUAGE plpgsql;


SELECT * FROM ClaimedFoodListing;
SELECT * FROM claimFoodListing(7, 2, 3);
SELECT * FROM ClaimedFoodListing;

