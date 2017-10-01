/**
 * A basic search function for retrieving food listings that meet specific criteria.
 * NOTE: This may need to be further optimized given that it will be dealing with a large amount of rows.
 *       -One idea is to combine the dynamic query and return query and just do the group by in one return query. The query optimizer may come through here.
 *       -Another idea is to first get all Food Listing keys that meet search criteria in a temp table using a dynamic query (no group by),
 *        and then do a group by off of the small amount of food listing keys.
 */
SELECT dropFunction('getFoodListings');
CREATE OR REPLACE FUNCTION getFoodListings
(
    _appUserKey                 INTEGER,                        -- The App User Key of the current user issuing this query.
    _retrievalOffset            INTEGER,                        -- The offset of records that should be retrieved.
    _retrievalAmount            INTEGER,                        -- The number of records that should be retrieved starting at _retrievalOffset.
    _foodListingKey             INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _foodTypes                  FoodType[]      DEFAULT NULL,   -- This is when we may be filtering by one or many food types. Null is for all food types.
    _perishable                 BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food? Input true for perishable only, false for non-perishable, and null for both.
    _availableAfterDate         TEXT            DEFAULT NULL,   -- Do we require food that is going to be available on or after a given date? Must be in the format MM/DD/YYYY!
    _unclaimedOnly              BOOLEAN         DEFAULT FALSE,  -- to TRUE if only unclaimed results should come back (When browsing Receive tab for claimable Food Listings).
    _myDonatedItemsOnly         BOOLEAN         DEFAULT FALSE,  -- Set to TRUE if only Donor Cart items should come back (this user's donated Food Listings only).
    _myClaimedItemsOnly         BOOLEAN         DEFAULT FALSE,  -- Set to TRUE if only Receiver Cart items should come back (this user's claimed Food Listings only).
    _matchAvailability          BOOLEAN         DEFAULT TRUE    -- Determines if th eitems that are viewed were donated by a Donor whose availability overlaps this user's.
)
RETURNS TABLE
(
    foodListingKey              INTEGER,
    foodTitle                   VARCHAR(100),
    foodTypes                   FoodType[],
    perishable                  BOOLEAN,
    donorOrganizationName       VARCHAR(128),
    donorOrganizationAddress    VARCHAR(128),
    donorOrganizationCity       VARCHAR(60),
    donorOrganizationState      CHAR(2),
    donorOrganizationZip        INTEGER,
    donorPhoneNumber            CHAR(12),
    donorLastName               VARCHAR(60),
    donorFirstName              VARCHAR(60),
    donorOnHandUnitsCount       INTEGER,
    availableUnitsCount         INTEGER,
    totalUnitsCount             INTEGER,
    unitsLabel                  TEXT,
    availableUntilDate          TEXT,
    foodDescription             TEXT,
    imgUrl                      TEXT
)
AS $$
    DECLARE _currentWeekday      INTEGER; -- [0, 6] index of the current weekday.
    DECLARE _queryBase           VARCHAR(2000);
    DECLARE _queryFilters        VARCHAR(2000);
    DECLARE _queryGroupAndSort   VARCHAR(2000);
BEGIN

-- ================= Preprocessing Phase - Calculate Relative Available Dates for this user ================== --
-- =========================================================================================================== --

    -- Is the user concerned with matching Donor availability with their own?
    _matchAvailability := (     _matchAvailability
                            -- If either of following are TRUE, then we are in cart and don't care about availability!
                            AND _myDonatedItemsOnly <> TRUE
                            AND _myClaimedItemsOnly <> TRUE);

    IF (_matchAvailability = TRUE)
    THEN

        -- Grab [0, 6] index of current day of week.
        _currentWeekday = (SELECT EXTRACT(DOW FROM CURRENT_DATE));

        -- This table will be filled with actual timestamps (dates) of availability over the span of the next week relative to today.
        -- These dates are used to determine if the user has an opportunity to receive donated food before it is no longer available.
        -- In other words, it makes their availability schedule comparable to regular date timestamps.
        DROP TABLE IF EXISTS RelativeAvailabilityDates;
        CREATE TEMP TABLE RelativeAvailabilityDates
        (
            appUserAvailabilityKey  INTEGER     PRIMARY KEY,
            relativeAvailableDate   TIMESTAMP
        );

        INSERT INTO RelativeAvailabilityDates
        SELECT      appUserAvailabilityKey,
                    CURRENT_DATE + INTERVAL '1' day * ((weekday - _currentWeekday) % 7)
        FROM        AppUserAvailability
        WHERE       appUserKey = _appUserKey;
        
    END IF;


-- ==================================== Dynamic Query Generation Phase ======================================= --
-- =========================================================================================================== --

    -- We will fill this table with our filtered food listings and associated food types (in aggregate array form).
    DROP TABLE IF EXISTS FiltFoodListing;
    CREATE TEMP TABLE FiltFoodListing
    (
        foodListingKey  INTEGER PRIMARY KEY
    );

    -- We will pull back the filtered aggregate food listing keys. This query, without the group by aggregate,
    -- would pull back rows that have duplicate values for each member other than the food type column(s).
    _queryBase := '
        INSERT INTO FiltFoodListing
        SELECT      FoodListing.foodListingKey
        FROM        FoodListing
        INNER JOIN  FoodListingFoodTypeMap ON FoodListing.foodListingKey = FoodListingFoodTypeMap.foodListingKey
    ';

    _queryFilters := '
        WHERE ($1 IS NULL   OR FoodListing.foodListingKey = $1)
          -- We will translate the list of food type descriptions into integer keys for lookup efficiency.
          AND ($2 IS NULL   OR FoodListingFoodTypeMap.foodType = ANY($2))
          AND ($3 IS NULL   OR FoodListing.perishable = $3)
          AND ($4 IS NULL   OR FoodListing.availableUntilDate >= TO_TIMESTAMP($4, ''MM/DD/YYYY''))
          AND ($5 IS NULL   OR FoodListing.donatedByAppUserKey = $5)
    ';

    -- Do we have any filter pertaining to claimer?
    IF (_myClaimedItemsOnly = TRUE)
    THEN

        _queryBase := _queryBase || '
            INNER JOIN  ClaimedFoodListing ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
        ';

        _queryFilters := _queryFilters || '
            AND (ClaimedFoodListing.claimedByAppUserKey = $6)
        ';

    -- Do we want to exclude all claimed food listings?
    ELSIF (_unclaimedOnly = TRUE)
    THEN

        -- If we have at least 1 member in ClaimedFoodListing for our FoodListing that we are examining, then it has been claimed.
        _queryFilters := _queryFilters || '
            AND (FoodListing.availableUnitsCount > 0)
        ';

    END IF;

    -- Should we match by Donor availability?
    IF (_matchAvailability = TRUE)
    THEN

        _queryBase := _queryBase || '
            INNER JOIN  AppUserAvailability ReceiverAvailability ON ReceiverAvailability.appUserKey = $7
            INNER JOIN  RelativeAvailabilityDates ON ReceiverAvailability.appUserAvailabilityKey = RelativeAvailabilityDates.appUserAvailabilityKey
            INNER JOIN  AppUserAvailability DonorAvailability ON FoodListing.donatedByAppUserKey = DonorAvailability.appUserKey
        ';

        -- NOTE: We may not want to simply find an overlap in time range here!
        --       For example, it may be unrealistic to think that a single overlap of only 1/2 hour is enough to get food from Donor to Receiver!
        _queryFilters := _queryFilters || '
            AND DonorAvailability.weekday = ReceiverAvailability.weekday
            AND DonorAvailability.startTime < ReceiverAvailability.endTime
            AND DonorAvailability.endTime > ReceiverAvailability.startTime
            AND RelativeAvailabilityDates.relativeAvailableDate <= FoodListing.availableUntilDate
        ';
        -- TODO: Ensure that 

    END IF;

    _queryGroupAndSort := '
        GROUP BY FoodListing.foodListingKey
        ORDER BY FoodListing.availableUntilDate
        OFFSET $8
        LIMIT $9
    ';


-- ==================================== Dynamic Query Execution Phase ======================================== --
-- =========================================================================================================== --

    --RAISE NOTICE '% % %', _queryBase, _queryFilters, _queryGroupAndSort;

    -- Insert our filtered Food Listing Key - Food Listing Types pairs into our temporary table.
    EXECUTE (_queryBase || _queryFilters || _queryGroupAndSort)
    USING _foodListingKey,
          _foodTypes,
          _perishable,
          _availableAfterDate,
          CASE (_myDonatedItemsOnly)
            WHEN TRUE THEN _appUserKey
            ELSE NULL 
          END,
          CASE (_myClaimedItemsOnly)
            WHEN TRUE THEN _appUserKey
            ELSE NULL
          END,
          CASE (_matchAvailability)
            WHEN TRUE THEN _appUserKey
            ELSE NULL
          END,
          _retrievalOffset,
          _retrievalAmount;
    

-- ==================================== Final Return Phase ======================================= --
-- =============================================================================================== --

    -- Here we will be doing a select using the filtered food listing keys from the dynamic query above. No grouping will be necessary.
    RETURN QUERY
    SELECT  FoodListing.foodListingKey,
            FoodListing.foodTitle,
            -- Concatenates the food types into an array { Type1, Type2, ..., TypeN }
            (
                SELECT ARRAY_AGG(FoodListingFoodTypeMap.foodType) AS foodTypes
                FROM FoodListingFoodTypeMap
                WHERE FoodListingFoodTypeMap.foodListingKey = FoodListing.foodListingKey
                GROUP BY FoodListingFoodTypeMap.foodListingKey
            ),
            FoodListing.perishable,
            DonatedByOrganization.name,
            DonatedByContactInfo.address,
            DonatedByContactInfo.city,
            DonatedByContactInfo.state,
            DonatedByContactInfo.zip,
            DonatedByContactInfo.phone,
            DonatedByAppUser.lastName,
            DonatedByAppUser.firstName,
            (SELECT getDonorOnHandUnitsCount(FoodListing.foodListingKey)),
            (SELECT getAvailableUnitsCount(FoodListing.foodListingKey)),
            (SELECT getTotalUnitsCount(FoodListing.foodListingKey)),
            FoodListing.unitsLabel,
            TO_CHAR(FoodListing.availableUntilDate, 'MM/DD/YYYY'),
            FoodListing.foodDescription,
            FoodListing.imgUrl
    FROM FiltFoodListing
    INNER JOIN FoodListing                                          ON FiltFoodListing.foodListingKey = FoodListing.foodListingKey
    INNER JOIN AppUser                  AS DonatedByAppUser         ON FoodListing.donatedByAppUserKey = DonatedByAppUser.appUserKey
    INNER JOIN ContactInfo              AS DonatedByContactInfo     ON DonatedByAppUser.appUserKey = DonatedByContactInfo.appUserKey
    LEFT JOIN  Organization             AS DonatedByOrganization    ON DonatedByAppUser.appUserKey = DonatedByOrganization.appUserKey
    ORDER BY FoodListing.availableUntilDate ASC;

END;
$$ LANGUAGE plpgsql;

-- Test the Stored Procedure here --


/*
SELECT
    FoodListing.foodListingKey,
    ARRAY_AGG(FoodType.foodType) AS foodTypes -- Concatenates the food types into an array { Type1, Type2, ..., TypeN }
FROM FoodListing
INNER JOIN FoodListingFoodTypeMap   ON FoodListing.foodListingKey = FoodListingFoodTypeMap.foodListingKey
INNER JOIN FoodType                 ON FoodListingFoodTypeMap.foodTypeKey = FoodType.foodTypeKey
GROUP BY FoodListing.foodListingKey;
*/

--SELECT * FROM FoodListingFoodTypeMap;

--SELECT * FROM getFoodListings(1, 0, 1000, 52, NULL, NULL, NULL, TRUE, FALSE, FALSE, TRUE);
--SELECT * FROM RelativeAvailabilityDates;

/*

select getFoodListings(0, 25, 1);

select getFoodListings(0, 25, NULL, false, '{Grain}');

select getFoodListings(0, 25, NULL, false, '{Meat, Drink}');

*/
