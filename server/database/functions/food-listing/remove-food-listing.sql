/**
 * A basic function for adding a food listing.
 */
SELECT dropFunction('removefoodlisting');
CREATE OR REPLACE FUNCTION removeFoodListing
(
    _foodListingKey         INTEGER,
    _donatedByAppUserKey    INTEGER
)
RETURNS INTEGER -- The food listing key of the new food listing.
AS $$
BEGIN

    IF NOT EXISTS (SELECT *)
    
    DELETE FROM FoodListingFoodTypeMap
    WHERE 
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
