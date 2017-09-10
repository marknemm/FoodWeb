/**
 * A basic function for adding a food listing.
 */
SELECT dropFunction('addfoodlisting');
CREATE OR REPLACE FUNCTION addFoodListing
(
    _foodTypes          VARCHAR(60)[]   DEFAULT NULL,   -- What Food Types is this?
    _perishable         BOOLEAN         DEFAULT NULL,   -- Is the food perishable?
    _expireDate         TEXT            DEFAULT NULL,   -- The expiration date of the food.
    _donorAppUserKey    INTEGER         DEFAULT NULL,   -- The Donor ID keyNumber
    _foodDescription    TEXT            DEFAULT NULL,   -- A description of food, if the donor chooses to give one
    _imgURL             TEXT            DEFAULT NULL    -- URL for the image being stored/uploaded
)
RETURNS INTEGER -- The food listing key of the new food listing.
AS $$
    DECLARE _expTimeStamp TIMESTAMP = to_timestamp(_expireDate, 'MM/DD/YYYY');
    DECLARE _foodListingKey INTEGER;
    DECLARE _foodType VARCHAR(60)[];
BEGIN
    
    -- Insert the new food listing and get the food listing key for it.
    INSERT INTO FoodListing (perishable, expireDate, donatedByAppUserKey, foodDescription, imgUrl)
    VALUES (_perishable, _expTimeStamp, _donorAppUserKey, _foodDescription, _imgURL)
    RETURNING FoodListing.foodListingKey INTO _foodListingKey;

    -- Insert all the food types that are associated with the new food listing.
    FOR i IN array_lower(_foodTypes, 1) .. array_upper(_foodTypes, 1)
    LOOP
        INSERT INTO FoodListingFoodTypeMap (foodListingKey, foodTypeKey)
        VALUES (_foodListingKey, (SELECT foodTypeKey FROM FoodType WHERE FoodType.foodType = _foodTypes[i]));
    END LOOP;

    RETURN _foodListingKey;

END;
$$ LANGUAGE plpgsql;

--SELECT * FROM AppUser;
--SELECT addFoodListing('{ Meal, Dairy, Canned }', false, '1/2/2021', 2, NULL, NULL);
--SELECT * FROM FoodListing;
