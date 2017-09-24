SELECT dropFunction('beforeAvailableUnitsCountUpdate');
CREATE OR REPLACE FUNCTION beforeAvailableUnitsCountUpdate()
RETURNS TRIGGER
AS $$
    DECLARE _correctAvailableUnitsCount INTEGER;
BEGIN

    -- Calculate the correct available units count by taking total units count minus the units among all claimed food listings.
    SELECT  (NEW.totalUnitsCount - SUM(claimedUnitsCount))
    INTO    _correctAvailableUnitsCount
    FROM    ClaimedFoodListing
    WHERE   foodListingKey = NEW.foodListingKey;

    _correctAvailableUnitsCount := COALESCE(_correctAvailableUnitsCount, NEW.totalUnitsCount);

    -- If the update value for availableUnitsCount is not correct, then throw exception and do not perform update!
    IF (NEW.availableUnitsCount <> _correctAvailableUnitsCount)
    THEN
        RAISE EXCEPTION 'Preventing update of FoodListing.availableUnitsCount because the update value is incorrect.
                         (New_Count: %) <> (Correct_Count: %)
                         NOTE: FoodListing.availableUnitsCount should not be updated directly! It should only be updated
                         via trigger whenever ClaimedFoodListing entries are inserted or updated!',
                         NEW.availableUnitsCount, _correctAvailableUnitsCount;
    END IF;

    -- Everything checks out ok!
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
