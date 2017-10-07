/**
 * A basic function for adding a food listing.
 */
SELECT dropFunction('addfoodlisting');
CREATE OR REPLACE FUNCTION addFoodListing
(
    _donatedByAppUserKey    FoodListing.donatedByAppUserKey%TYPE,                   -- The Donor ID.
    _foodTypes              FoodType[],                                             -- What Food Types is this?
    _foodTitle              FoodListing.foodTitle%TYPE,                             -- The title (short description) of the Food Listing.
    _perishable             FoodListing.perishable%TYPE,                            -- Is the food perishable?
    _availableUntilDate     TEXT,                                                   -- The date when the donated food will no longer be available.
    _totalWeight            FoodListing.totalWeight%TYPE            DEFAULT NULL,   -- The total weight of (all parts/units of) the Food Listing (in pounds).
    _foodDescription        FoodListing.foodDescription%TYPE        DEFAULT NULL,   -- A (long) description of the Food Listing.
    _imgURL                 FoodListing.imgUrl%TYPE                 DEFAULT NULL,   -- URL for the image being stored/uploaded.
    _unitsCount             FoodListing.availableUnitsCount%TYPE    DEFAULT 1,      -- The total number of available parts/units that the Food Listing is split up into.
    _unitsLabel             FoodListing.unitsLabel%TYPE             DEFAULT NULL    -- The user provided label for each unit.
)
RETURNS FoodListing.foodListingKey%TYPE -- The food listing key of the new food listing (can be used as reference for edit).
AS $$
    DECLARE _availableUntilTimeStamp TIMESTAMP = to_timestamp(_availableUntilDate, 'MM/DD/YYYY');
    DECLARE _foodListingKey FoodListing.foodListingKey%TYPE;
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
        unitsLabel,
        foodDescription,
        imgUrl
    )
    VALUES (
        _donatedByAppUserKey,
        _foodTitle,
        _perishable,
        _availableUntilTimeStamp,
        _unitsCount,
        _unitsLabel,
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
