/**
 * A basic function for adding one or more food listings.
 */
CREATE OR REPLACE FUNCTION AddFoodListings
(
    _foodTypeKey        INTEGER[]         DEFAULT NULL,   -- What Food Type is this?
    _perishable         BOOLEAN[]         DEFAULT NULL,   -- Is the food perishable?
    _expireDate         TEXT[]            DEFAULT NULL    -- The expiration date of the food.
)
RETURNS VOID
AS $$
    DECLARE i INTEGER;
BEGIN
    
    FOR i IN ARRAY_LOWER(_foodTypeKey, 1) .. ARRAY_UPPER(_foodTypeKey, 1)
    LOOP
        raise notice 'Values: %, %, %', _foodTypeKey[i], _perishable[i], _expireDate[i];
    END LOOP;

END;
$$ LANGUAGE plpgsql;

SELECT AddFoodListings('{1, 2}', '{true, false}', '{1/2/2021, 1/2/2022}');
