/**
 * Cancels the delivery process for a Claimed Food Listing.
 */
SELECT dropFunction('cancelFoodListingDelivery');
CREATE OR REPLACE FUNCTION cancelFoodListingDelivery
(
     _deliveryFoodListingKey    INTEGER,    -- This is the key of the Delivery Food Listing that is to be cancelled.
     _cancelledByAppUserKey     INTEGER,    -- This is the key of the user who is cancelling the delivery of the Food Listing.
     _cancelReason              TEXT        -- The reason why the delivery was cancelled.
)
RETURNS INTEGER -- The cancelledDeliveryFoodListing primary key.
AS $$
    DECLARE _cancelledDeliveryFoodListingKey  INTEGER;
BEGIN

    -- TODO: Check that the cancelling app user and claimed food listing exist!
    -- TODO: Ensure that the cancelling app user is authorized (must be the donor, receiver, or deliverer only)!
    --       Additionally, the Donor cannot cancel the delivery after it has been picked up!

    INSERT INTO CancelledDeliveryFoodListing
    (
        deliveryFoodListingKey,
        cancelledByAppUserKey,
        cancelReason
    )
    VALUES
    (
        _deliveryFoodListingKey,
        _cancelledByAppUserKey,
        _cancelReason
    )
    RETURNING   cancelledDeliveryFoodListingKey
    INTO        _cancelledDeliveryFoodListingKey;

    RETURN _cancelledDeliveryFoodListingKey;

END;
$$ LANGUAGE plpgsql;
