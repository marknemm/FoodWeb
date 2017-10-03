-- Keeps records of all Deliveries (in process and finished).
-- NOTE: The timestamps are indicators of delivery status!

--DROP TABLE DeliveryFoodListing CASCADE; 
CREATE TABLE IF NOT EXISTS DeliveryFoodListing
(
    deliveryFoodListingKey SERIAL PRIMARY KEY
);

-- Key of Claimed Food Listing that is to be Delivered (or was delivered).
ALTER TABLE DeliveryFoodListing ADD COLUMN IF NOT EXISTS claimedFoodListingKey  INTEGER         NOT NULL REFERENCES ClaimedFoodListing (claimedFoodListingKey);

ALTER TABLE DeliveryFoodListing ADD COLUMN IF NOT EXISTS deliveryAppUserKey     INTEGER         NOT NULL REFERENCES AppUser (appUserKey);

-- Indicates when the deliverer has indicated that they will be deliverying the related Food Listing.
ALTER TABLE DeliveryFoodListing ADD COLUMN IF NOT EXISTS startTime              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Will be non-null if the Food Listing has been picked up from the Donor and is on-route to the Receiver.
ALTER TABLE DeliveryFoodListing ADD COLUMN IF NOT EXISTS pickUpTime             TIMESTAMP       DEFAULT NULL;

-- Will be non-null if the Food Listing has been dropped off at the Receiver destination.
ALTER TABLE DeliveryFoodListing ADD COLUMN IF NOT EXISTS dropOffTime            TIMESTAMP       DEFAULT NULL;


-- Add more columns here --

CREATE INDEX IF NOT EXISTS deliveryFoodListing_ClaimedFoodListingKeyIdx     ON DeliveryFoodListing (claimedFoodListingKey);

CREATE INDEX IF NOT EXISTS deliveryFoodListing_DeliveryAppUserKeyIdx        ON DeliveryFoodListing (DeliveryAppUserKey);

-- Create more indexes here --
