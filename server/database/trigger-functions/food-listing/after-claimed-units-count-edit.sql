SELECT dropFunction('afterClaimedUnitsCountEdit'); -- After inserting, updating, and deleting!
CREATE OR REPLACE FUNCTION afterClaimedUnitsCountEdit()
RETURNS TRIGGER
AS $$
    DECLARE _deltaAvailableUnitsCount   INTEGER;
    DECLARE _foodListingKey             INTEGER;
BEGIN

    -- Get change in availableUnitsCount based on the operation that activated this trigger.
    _deltaAvailableUnitsCount :=
    CASE (TG_OP)
        WHEN 'INSERT' THEN -NEW.claimedUnitsCount
        WHEN 'UPDATE' THEN (OLD.claimedUnitsCount - NEW.claimedUnitsCount)
        WHEN 'DELETE' THEN OLD.claimedUnitsCount
        ELSE 0
    END;

    _foodListingKey :=
    CASE (TG_OP)
        WHEN 'DELETE' THEN OLD.foodListingKey
        ELSE               NEW.foodListingKey
    END;

    -- Update the number of available units.
    -- NOTE: This will activate a before update trigger on the FoodListing.availableUnitsCount column!
    -- The trigger will check the new value based on the presence of ClaimedFoodListing rows.
    -- Therefore, this (onClaimedFoodListingInsert) trigger should only activate AFTER the insert happens!
    UPDATE  FoodListing
    SET     availableUnitsCount = (availableUnitsCount + _deltaAvailableUnitsCount)
    WHERE   foodListingKey = _foodListingKey;

    -- Everything checks out ok!
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
