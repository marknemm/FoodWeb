/**
 * Marks a DeliveryFoodListing element as picked up from Donor (on route to Receiver now).
 */
SELECT dropFunction('markFoodListingPickUp');
CREATE OR REPLACE FUNCTION markFoodListingPickUp
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
    SET     pickUpTime = CURRENT_TIMESTAMP
    WHERE   deliveryFoodListingKey = _deliveryFoodListingKey;

    RETURN _deliveryFoodListingKey;

END;
$$ LANGUAGE plpgsql;
