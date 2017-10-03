/**
 * Marks a DeliveryFoodListing element as dropped off (delivered at Receiver).
 */
SELECT dropFunction('markFoodListingDropOff');
CREATE OR REPLACE FUNCTION markFoodListingDropOff
(
     _deliveryFoodListingKey    INTEGER,    -- This is the key of the Delivery Food Listing element that we are updating the status of.
     _deliveryAppUserKey        INTEGER     -- This is the key of the user who is delivering the Food Listing.
)
RETURNS INTEGER -- The deliveryFoodListing primary key.
AS $$
    DECLARE _deliveryFoodListingKey  INTEGER;
BEGIN

    -- TODO: Check that the delivery app user and delivery food listing exist!
    -- TODO: Ensure that delivery app user is associated with this delivery food listing (has rights to update)!

    UPDATE  DeliveryFoodListing
    SET     dropOffTime = CURRENT_TIMESTAMP
    WHERE   deliveryFoodListingKey = _deliveryFoodListingKey;

    RETURN _deliveryFoodListingKey;

END;
$$ LANGUAGE plpgsql;
