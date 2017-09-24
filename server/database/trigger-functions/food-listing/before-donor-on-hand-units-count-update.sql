SELECT dropFunction('beforeDonorOnHandUnitsCountUpdate');
CREATE OR REPLACE FUNCTION beforeDonorOnHandUnitsCountUpdate()
RETURNS TRIGGER
AS $$
    DECLARE _correctDonorOnHandUnitsCount INTEGER;
BEGIN

    -- Calculate the correct donor on-hand units count by taking total units count minus count of all units in a delivery phase.
    SELECT      (NEW.totalUnitsCount - SUM(claimedUnitsCount))
    INTO        _correctDonorOnHandUnitsCount
    FROM        ClaimedFoodListing
    INNER JOIN  DeliveryFoodListing ON ClaimedFoodListing.claimedFoodListingKey = DeliveryFoodListing.claimedFoodListingKey
    WHERE       foodListingKey = NEW.foodListingKey;

    _correctDonorOnHandUnitsCount := COALESCE(_correctDonorOnHandUnitsCount, NEW.totalUnitsCount);

    -- If the update value for donorOnHandUnitsCount is not correct, then throw exception and do not perform update!
    IF (NEW.donorOnHandUnitsCount <> _correctDonorOnHandUnitsCount)
    THEN
        RAISE EXCEPTION 'Preventing update of FoodListing.donorOnHandUnitsCount because the update value is incorrect.
                         (New_Count: %) <> (Correct_Count: %)
                         NOTE: FoodListing.donorOnHandUnitsCount should not be updated directly! It should only be updated
                         via trigger whenever DeliveryFoodListing entries are inserted, updated, or deleted!',
                         NEW.donorOnHandUnitsCount, _correctDonorOnHandUnitsCount;
    END IF;

    -- Everything checks out ok!
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
