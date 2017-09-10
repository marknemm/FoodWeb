SELECT dropFunction('unclaimFoodListing');
CREATE OR REPLACE FUNCTION unclaimFoodListing
(
     _foodListingKey        INTEGER,                -- This is the key of the Food Listing that is being unclaimed.
     _claimedByAppUserKey   INTEGER DEFAULT NULL    -- This is the key of the user who is unclaiming the Food Listing.
                                                    -- NOTE: Should only be NULL if all claims on food listing are to be deleted regardless of user!
)
RETURNS VOID
AS $$
BEGIN

    -- Make sure the food listing(s) we are to delete exist(s).
    IF (    
            _claimedByAppUserKey IS NOT NULL
        AND NOT EXISTS ( SELECT 1
                         FROM ClaimedFoodListing
                         WHERE foodListingKey = _foodListingKey
                           AND claimedByAppUserKey = _claimedByAppUserKey )
    )
    THEN
        RAISE EXCEPTION 'Claimed food listing does not exist.';
    END IF;

    -- Perform the actual delete now.
    DELETE FROM ClaimedFoodListing
    WHERE foodListingKey = _foodListingKey
      AND (_claimedByAppUserKey IS NULL OR claimedByAppUserKey = _claimedByAppUserKey);

END;
$$ LANGUAGE plpgsql;

/*
SELECT * FROM ClaimedFoodListing;
SELECT * FROM unclaimFoodListing(5, 4);
SELECT * FROM ClaimedFoodListing;
*/
