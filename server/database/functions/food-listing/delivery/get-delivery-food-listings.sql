/**
 * Gets Delivery Food Listing elements based off of filter criteria.
 */
SELECT dropFunction('getDeliveryFoodListings');
CREATE OR REPLACE FUNCTION getDeliveryFoodListings
(
     _appUserKey            AppUser.appUserKey%TYPE,    -- The key identifier of the logged in user (deliverer).
     _retrievalOffset       INTEGER,                    -- The offset location where we will start retrieving results (beginning of range of results).
     _retrievalAmount       INTEGER,                    -- The amount of results that we will retrieve (_retrievalOffset + _retrievalAmount is end of range).
     _maxDistance           INTEGER DEFAULT NULL,       -- The maximum distance (mi) of Donors and Reivers from the (potential) deliverer.
     _maxTotalWeight        INTEGER DEFAULT NULL,       -- The maximum total weight of the delivery.
     _myScheduledDeliveries BOOLEAN DEFAULT FALSE       -- Set to true if we should pull back deliveries that are scheduled or in process for deliverer.
)
RETURNS TABLE
(
    claimedFoodListingKey   ClaimedFoodListing.claimedFoodListingKey%TYPE,
    deliveryFoodListing     JSON
)
AS $$
BEGIN

    RETURN QUERY
    SELECT  claimed

END;
$$ LANGUAGE plpgsql;
