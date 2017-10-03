-- Keeps records of all cancelled Deliveries.
-- Should only be cancelled if the deliverer cannot make the drive, or if the food has gone bad / not handled properly.

--DROP TABLE CancelledDeliveryFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS CancelledDeliveryFoodListing
(
    cancelledDeliveryFoodListingKey SERIAL PRIMARY KEY
);

-- Key of Delivery Food Listing that is to be Cancelled.
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS deliveryFoodListingKey INTEGER NOT NULL REFERENCES DeliveryFoodListing (deliveryFoodListingKey);

-- The key identifier of the user who cancelled the delivery. Should only be the donor, claimer (receiver), or deliverer!
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS cancelledByAppUserKey  INTEGER NOT NULL REFERENCES AppUser (appUserKey);

-- The reason for the cancellation (should be required by front-end interface).
ALTER TABLE CancelledDeliveryFoodListing ADD COLUMN IF NOT EXISTS cancelReason           TEXT    NOT NULL;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS cancelledDeliveryFoodListing_DeliveryFoodListingKeyIdx     ON CancelledDeliveryFoodListing (deliveryFoodListingKey);

CREATE INDEX IF NOT EXISTS cancelledDeliveryFoodListing_CancelledByAppUserKeyIdx      ON CancelledDeliveryFoodListing (cancelledByAppUserKey);

-- Create more indexes here --
