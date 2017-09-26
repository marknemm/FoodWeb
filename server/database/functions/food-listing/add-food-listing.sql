/**
 * A basic function for adding a food listing.
 */
SELECT dropFunction('addfoodlisting');
CREATE OR REPLACE FUNCTION addFoodListing
(
    _donorAppUserKey    INTEGER,                        -- The Donor ID.
    _foodTypes          FoodType[],                     -- What Food Types is this?
    _foodTitle          VARCHAR(100),                   -- The title (short description) of the Food Listing.
    _perishable         BOOLEAN,                        -- Is the food perishable?
    _availableUntilDate TEXT,                           -- The date when the donated food will no longer be available.
    _totalWeight        INTEGER         DEFAULT NULL,   -- The total weight of (all parts/units of) the Food Listing (in pounds).
    _foodDescription    TEXT            DEFAULT NULL,   -- A (long) description of the Food Listing.
    _imgURL             TEXT            DEFAULT NULL,   -- URL for the image being stored/uploaded.
    _unitsCount         INTEGER         DEFAULT 1,      -- The total number of available parts/units that the Food Listing is split up into.
    _unitsLabel         TEXT            DEFAULT NULL    -- The user provided label for each unit.
)
RETURNS INTEGER -- The food listing key of the new food listing (can be used as reference for edit).
AS $$
    DECLARE _availableUntilTimeStamp TIMESTAMP = to_timestamp(_availableUntilDate, 'MM/DD/YYYY');
    DECLARE _foodListingKey INTEGER;
BEGIN

    -- If NULL is explicitely passed in, then we must explicitely default to 1 for total number of units/parts!
    IF (_unitsCount IS NULL)
    THEN
        _unitsCount := 1;
    END IF;
    
    -- Insert the new food listing and get the food listing key for it.
    INSERT INTO FoodListing (
        donatedByAppUserKey,
        foodTitle,
        perishable,
        availableUntilDate,
        availableUnitsCount,
        foodDescription,
        imgUrl
    )
    VALUES (
        _donorAppUserKey,
        _foodTitle,
        _perishable,
        _availableUntilTimeStamp,
        _unitsCount,
        _foodDescription,
        _imgURL
    )
    RETURNING   foodListingKey
    INTO        _foodListingKey;

    -- Insert all the food types that are associated with the new food listing.
    FOR i IN array_lower(_foodTypes, 1) .. array_upper(_foodTypes, 1)
    LOOP
        INSERT INTO FoodListingFoodTypeMap (foodListingKey, foodType)
        VALUES      (_foodListingKey, _foodTypes[i]);
    END LOOP;

    RETURN _foodListingKey;

END;
$$ LANGUAGE plpgsql;

--SELECT * FROM AppUser;
--SELECT addFoodListing(1, '{ Meal, Dairy }', 'Some food with many parts!', false, '1/2/2021', 2, 'Description of food here!', NULL, 10, 'bottles');
--SELECT * FROM FoodListing;
