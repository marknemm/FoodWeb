/**
 * A basic function for adding a food listing.
 */
SELECT dropFunction('addfoodlisting');
CREATE OR REPLACE FUNCTION addFoodListing
(
    _foodType           VARCHAR(60)     DEFAULT NULL,   -- What Food Type is this?
    _perishable         BOOLEAN         DEFAULT NULL,   -- Is the food perishable?
    _expireDate         TEXT            DEFAULT NULL,   -- The expiration date of the food.
    _appUserKey         INTEGER         DEFAULT NULL,   -- The Donor ID keyNumber
    _foodDescription    TEXT            DEFAULT NULL,   -- A description of food, if the donor chooses to give one
    _imgURL             TEXT            DEFAULT NULL    -- URL for the image being stored/uploaded
)
RETURNS VOID
AS $$
    DECLARE _expTimeStamp TIMESTAMP = to_timestamp(_expireDate, 'DD/MM/YYYY');
    DECLARE _postDate TIMESTAMP = now();
    DECLARE _foodTypeKey INTEGER;
BEGIN
    
    raise notice 'Values: %, %, %', _foodType, _perishable, _expireDate;
    SELECT foodTypeKey INTO _foodTypeKey FROM FoodType WHERE foodTypeDescription = _foodType; 

    INSERT INTO FoodListing (foodTypeKey, perishable, expireDate, 
                                postedByAppUserKey, foodDescription, imgurl, postDate)
    SELECT _foodTypeKey, _perishable, _expTimeStamp, _appUserKey, _foodDescription, _imgURL, _postDate;

END;
$$ LANGUAGE plpgsql;

--SELECT * FROM AppUser;
--SELECT * FROM FoodType;
--SELECT addFoodListing('Grain', false, '1/2/2021', 13, NULL, NULL);
--SELECT * FROM FoodListing;
