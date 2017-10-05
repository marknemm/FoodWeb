/**
 * Gets a textual representation of the delivery state that a (Delivery) Food Listing is in based off of its members.
 */
SELECT dropFunction('getDeliveryState');
CREATE OR REPLACE FUNCTION getDeliveryState
(
     _startTime     TIMESTAMP,
     _pickUpTime    TIMESTAMP,
     _dropOffTime   TIMESTAMP
)
RETURNS TEXT -- The textual representation of the delivery state.
AS $$

    SELECT CASE
        WHEN (_dropOffTime IS NOT NULL) THEN 'Delivery Finished'
        WHEN (_pickUpTime IS NOT NULL)  THEN 'On Route to Receiver'
        WHEN (_startTime IS NOT NULL)   THEN 'On Route to Donor'
        ELSE                                 'Delivery Not Started'
    END;

$$ LANGUAGE sql;
