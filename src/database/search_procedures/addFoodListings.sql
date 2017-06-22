/**
 * A basic function for adding a food listing.
 */
CREATE OR REPLACE FUNCTION AddFoodListing
(
    _foodTypeKey        INTEGER         DEFAULT NULL,   -- What Food Type is this?
    _perishable         BOOLEAN         DEFAULT NULL,   -- Is the food perishable?
    _expireDate         TEXT            DEFAULT NULL    -- The expiration date of the food.
)
RETURNS VOID
AS $$
BEGIN
    
    raise notice 'Values: %, %, %', _foodTypeKey, _perishable, _expireDate;
    -- TODO: insert each entry into the FoodListing table.

END;
$$ LANGUAGE plpgsql;

SELECT AddFoodListing(1, true, '1/2/2021');
