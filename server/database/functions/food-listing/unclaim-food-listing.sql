SELECT dropFunction('unclaimFoodListing');
CREATE OR REPLACE FUNCTION unclaimFoodListing
(
    _foodListingKey         INTEGER,                -- This is the key of the Food Listing that is being unclaimed.
    _claimedByAppUserKey    INTEGER DEFAULT NULL,   -- This is the key of the user who is unclaiming the Food Listing and holds the claim (never Donor's key).
                                                    -- NOTE: Should only be NULL if all claims on food listing are to be deleted regardless of user!
    _unitsCount             INTEGER DEFAULT NULL    -- The number of units/parts that the Receiver is unclaiming.
                                                    -- NOTE: NULL is interpreted as * all units *!
)
RETURNS VOID
AS $$
    DECLARE _totalClaimedUnitsCount     INTEGER DEFAULT 0;
    DECLARE _unclaimCandidate           RECORD;
BEGIN

    -- Create a temporary table that will be filled with all of the Claimed Food Listing candidates for unclaiming (based on function args).
    DROP TABLE IF EXISTS UnclaimCandidates;
    CREATE TEMP TABLE UnclaimCandidates
    (
        claimedFoodListingKey   INTEGER,
        claimedUnitsCount       INTEGER,
        claimedDate             TIMESTAMP
    );

    -- Grab all of the keys of Claimed Food Listings that are candidates for being unclaiemd.
    -- NOTE: The result set here should be very small (<= 3 rows on average).
    INSERT INTO UnclaimCandidates
    SELECT      claimedFoodListingKey,
                claimedUnitsCount,
                claimedDate
    FROM        ClaimedFoodListing
    WHERE       foodListingKey = _foodListingKey
      AND       (_claimedByAppUserKey IS NULL OR claimedByAppUserKey = _claimedByAppUserKey)
      -- The claimed food listings (to be unclaimed) should not have yet entered the delivery phase!
      AND       NOT EXISTS (
                    SELECT  1 FROM DeliveryFoodListing
                    WHERE   ClaimedFoodListing.claimedFoodListingKey = DeliveryFoodListing.claimedFoodListingKey
                );

    -- Grab the total number of Claimed Food Listing units among the unclaim candidates for edit check.
    SELECT      SUM(claimedUnitsCount)
    INTO        _totalClaimedUnitsCount
    FROM        UnclaimCandidates;


    -- Make sure the claimed food listing we are to delete exists.
    IF (_totalClaimedUnitsCount = 0 OR _totalClaimedUnitsCount IS NULL)
    THEN
        RAISE EXCEPTION 'Either the claimed food listing does not exist, or the current user is not authroized to unclaim the given listing.';
    END IF;

    -- Make sure we are not removing more claimed Food Listing units (parts) than we have.
    IF (_unitsCount IS NOT NULL AND _unitsCount > _totalClaimedUnitsCount)
    THEN
        RAISE EXCEPTION 'Attempting to unclaim more food listing units than the number that exists.';
    END IF;

    -- If the number of units to remove is unspecified, then assign it to total number of claimed units under the Food Listing.
    IF (_unitsCount IS NULL)
    THEN
        _unitsCount := _totalClaimedUnitsCount;
    END IF;


    -- Get rid of claims by removing specified number of units from each claimed food listing matching function arguments.
    -- If given a specific App User who originally claimed the listing, then we will only be interacting with one claim here (single iteration).
    -- If not given specific App User, then will be looping through all claims on the given Food Listing in order from youngest claim to oldest.
    FOR _unclaimCandidate IN (
        SELECT      *
        FROM        UnclaimCandidates
        ORDER BY    claimedDate DESC
    )
    LOOP

        -- If we have less claim units to remove than the number of units in the examined Claimed Food Listing.
        IF (_unclaimCandidate.claimedUnitsCount > _unitsCount)
        THEN

            -- Update the claim units count.
            UPDATE  ClaimedFoodListing
            SET     claimedUnitsCount = (claimedUnitsCount - _unitsCount)
            WHERE   claimedFoodListingKey = _unclaimCandidate.claimedFoodListingKey;

        -- Else we have more than or equal the number of units in the examined Claimed Food Listing.
        ELSE

            -- Remove the claim entirely (units have reached 0).
            DELETE FROM ClaimedFoodListing
            WHERE       claimedFoodListingKey = _unclaimCandidate.claimedFoodListingKey;

        END IF;

        _unitsCount := (_unitsCount - _unclaimCandidate.claimedUnitsCount); -- Update the number of remaining Claimed Food Listing units.
        EXIT WHEN (_unitsCount <= 0); -- Exit loop here since we have removed all of the units from ClaimedFoodListings fitting argument criteria.
    
    END LOOP;

END;
$$ LANGUAGE plpgsql;

SELECT * FROM ClaimedFoodListing;
SELECT * FROM unclaimFoodListing(1);
SELECT * FROM ClaimedFoodListing;
