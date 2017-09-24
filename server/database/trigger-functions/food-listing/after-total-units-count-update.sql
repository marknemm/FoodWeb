SELECT dropFunction('afterTotalUnitsCountUpdate');
CREATE OR REPLACE FUNCTION afterTotalUnitsCountUpdate()
RETURNS TRIGGER
AS $$
    DECLARE _deltaTotalUnitsCount INTEGER;
BEGIN

    _deltaTotalUnitsCount := (NEW.totalUnitsCount - OLD.totalUnitsCount);

    -- Update the calculated aggregates of available and donor on hand units counts.
    UPDATE  FoodListing
    SET     availableUnitsCount = (availableUnitsCount + _deltaTotalUnitsCount),
            donorOnHandUnitsCount = (donorOnHandUnitsCount + _deltaTotalUnitsCount)
    WHERE   foodListingKey = NEW.foodListingKey;

    -- Everything checks out ok!
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
