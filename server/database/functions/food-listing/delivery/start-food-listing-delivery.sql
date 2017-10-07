/**
 * Starts the delivery process for a Claimed Food Listing.
 */
SELECT dropFunction('startFoodListingDelivery');
CREATE OR REPLACE FUNCTION startFoodListingDelivery
(
     _claimedFoodListingKey DeliveryFoodListing.deliveryFoodListingKey%TYPE,    -- This is the key of the Claimed Food Listing that is to be delivered.
     _deliveryAppUserKey    DeliveryFoodListing.deliveryAppUserKey%TYPE         -- This is the key of the user who is delivering the Food Listing.
)
RETURNS DeliveryFoodListing.deliveryFoodListingKey%TYPE -- The deliveryFoodListing primary key.
AS $$
    DECLARE _deliveryFoodListingKey  DeliveryFoodListing.deliveryFoodListingKey%TYPE;
BEGIN

    -- TODO: Check that the delivery app user and claimed food listing exist!

    INSERT INTO DeliveryFoodListing
    (
        claimedFoodListingKey,
        deliveryAppUserKey
    )
    VALUES
    (
        _claimedFoodListingKey,
        _deliveryAppUserKey
    )
    RETURNING   deliveryFoodListingKey
    INTO        _deliveryFoodListingKey;

    RETURN _deliveryFoodListingKey;

END;
$$ LANGUAGE plpgsql;
