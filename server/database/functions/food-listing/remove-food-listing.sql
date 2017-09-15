/**
 * A basic function for removing a food listing and any associated data.
 */
SELECT dropFunction('removefoodlisting');
CREATE OR REPLACE FUNCTION removeFoodListing
(
    _foodListingKey         INTEGER,
    _donatedByAppUserKey    INTEGER
)
RETURNS VOID -- TODO: Return contact info of App User who lost their claim due to this action for email notification!
AS $$
BEGIN

    -- Make sure the food listing we are to delete exists and was donated by user issuing this command.
    IF NOT EXISTS (
        SELECT 1
        FROM FoodListing
        WHERE FoodListing.foodListingKey = _foodListingKey
          AND FoodListing.appUserKey = _appUserKey
    )
    THEN
        RAISE EXCEPTION 'Food listing does not exist, or user not authorized.';
    END IF;
    
    -- Delete Food Type associations.
    DELETE FROM FoodListingFoodTypeMap
    WHERE FoodListingFoodTypeMap.foodListingKey = _foodListingKey;

    -- Delete any claims on the Food Listing.
    DELETE FROM ClaimedFoodListing
    WHERE ClaimedFoodListing.foodListingKey = _foodListingKey;

    -- Delete the actual Food Listing.
    DELETE FROM FoodListing
    WHERE FoodListingKey = _foodListingKey;

END;
$$ LANGUAGE plpgsql;
