/**
 * Gets the count of available units for a given Food Listing.
 */
SELECT dropFunction('getAvailableUnitsCount');
CREATE OR REPLACE FUNCTION getAvailableUnitsCount
(
     _foodListingKey INTEGER
)
RETURNS INTEGER -- The count of available units for a given Food Listing.
AS $$

    -- Calculate the number of available parts for the given Food Listing.
    SELECT  availableUnitsCount
    FROM    FoodListing
    WHERE   foodListingKey = _foodListingKey;

$$ LANGUAGE sql;
