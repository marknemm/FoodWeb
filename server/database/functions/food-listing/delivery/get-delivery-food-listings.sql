/**
 * Marks a DeliveryFoodListing element as dropped off (delivered at Receiver).
 */
SELECT dropFunction('getDeliveryFoodListings');
CREATE OR REPLACE FUNCTION getDeliveryFoodListings
(
     _appUserKey            INTEGER,                -- The key identifier of the logged in user (deliverer).
     _retrievalOffset       INTEGER,                -- The offset location where we will start retrieving results (beginning of range of results).
     _retrievalAmount       INTEGER,                -- The amount of results that we will retrieve (_retrievalOffset + _retrievalAmount is end of range).
     _maxDistance           INTEGER DEFAULT NULL,   -- The maximum distance (mi) of Donors and Reivers from the (potential) deliverer.
     _maxTotalWeight        INTEGER DEFAULT NULL,   -- The maximum total weight of the delivery.
     _myScheduledDeliveries BOOLEAN DEFAULT FALSE   -- Set to true if we should pull back deliveries that are scheduled or in process for deliverer.
)
RETURNS TABLE
(
    deliveryFoodListingKey  INTEGER,
    deliveryFoodListing     JSON
)
AS $$
BEGIN

    -- TODO: Check that the delivery app user and delivery food listing exist!
    -- TODO: Ensure that delivery app user is associated with this delivery food listing (has rights to update)!

    UPDATE  DeliveryFoodListing
    SET     dropOffTime = CURRENT_TIMESTAMP
    WHERE   deliveryFoodListingKey = _deliveryFoodListingKey;

    RETURN _deliveryFoodListingKey;

END;
$$ LANGUAGE plpgsql;
