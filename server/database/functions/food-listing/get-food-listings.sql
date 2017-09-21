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
    _retrievalOffset            INTEGER,                        -- The offset of records that should be retrieved.
    _retrievalAmount            INTEGER,                        -- The number of records that should be retrieved starting at _retrievalOffset.
    _foodListingKey             INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _unclaimedOnly              BOOLEAN         DEFAULT FALSE,  -- to true if only unclaimed results should come back.
    _foodTypes                  FoodType[]      DEFAULT NULL,   -- This is when we may be filtering by one or many food types. Null is for all food types.
    _perishable                 BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food? Input true for perishable only, false for non-perishable, and null for both.
    _availableUntilDate         TEXT            DEFAULT NULL,   -- Do we require food that is going to be available until a given date? Must be in the format MM/DD/YYYY!
    _DonatedByAppUserKey        INTEGER         DEFAULT NULL,   -- App User key of the logged in AppUser who is trying to view the items they donated.
    _claimedByAppUserKey        INTEGER         DEFAULT NULL    -- App User key of the logged in AppUser who is trying to view the items they claimed.
)
RETURNS TABLE
(
    foodListingKey              INTEGER,
    foodTypes                   FoodType[],
    perishable                  BOOLEAN,
    donorOrganizationName       VARCHAR(128),
    donorOrganizationAddress    VARCHAR(128),
    donorOrganizationCity       VARCHAR(60),
    donorOrganizationState      CHAR(2),
    donorOrganizationZip        INTEGER,
    donorLastName               VARCHAR(60),
    donorFirstName              VARCHAR(60),
    availableUntilDate          TEXT,
    foodDescription             TEXT,
    imgUrl                      TEXT
)
AS $$
    DECLARE queryBase           VARCHAR(2000);
    DECLARE queryFilters        VARCHAR(2000);
    DECLARE queryGroupAndSort   VARCHAR(2000);
BEGIN

    -- We will fill this table with our filtered food listings and associated food types (in aggregate array form).
    DROP TABLE IF EXISTS FiltFoodListing;
    CREATE TEMP TABLE FiltFoodListing
    (
        foodListingKey  INTEGER PRIMARY KEY
    );

-- ==================================== Dynamic Query Generation Phase ======================================= --
-- =========================================================================================================== --

    -- We will pull back the filtered aggregate food listing keys. This query, without the group by aggregate,
    -- would pull back rows that have duplicate values for each member other than the food type column(s).
    queryBase := '
        INSERT INTO FiltFoodListing
        (
            foodListingKey
        )
        SELECT
            FoodListing.foodListingKey
        FROM FoodListing
        INNER JOIN FoodListingFoodTypeMap   ON FoodListing.foodListingKey = FoodListingFoodTypeMap.foodListingKey
    ';

    queryFilters := '
        WHERE ($1 IS NULL   OR FoodListing.foodListingKey = $1)
          -- We will translate the list of food type descriptions into integer keys for lookup efficiency.
          AND ($2 IS NULL   OR FoodListingFoodTypeMap.foodType = ANY($2))
          AND ($3 IS NULL   OR FoodListing.perishable = $3)
          AND ($4 IS NULL   OR FoodListing.availableUntilDate >= TO_TIMESTAMP($4, ''MM/DD/YYYY''))
          AND ($5 IS NULL   OR FoodListing.donatedByAppUserKey = $5)
    ';

    -- Do we have any filter pertaining to claimer?
    IF (_claimedByAppUserKey IS NOT NULL)
    THEN

        queryBase := queryBase || '
            INNER JOIN ClaimedFoodListing ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
        ';

        queryFilters := queryFilters || '
              AND (ClaimedFoodListing.claimedByAppUserKey = $6)
        ';

    END IF;

    -- Do we want to exclude all claimed food listings?
    IF (_unclaimedOnly = true)
    THEN
        -- If we have at least 1 member in ClaimedFoodListing for our FoodListing that we are examining, then it has been claimed.
        queryFilters := queryFilters || '
              AND NOT EXISTS (
                  SELECT 1
                  FROM   ClaimedFoodListing As ExcludeClaimedFoodListing
                  WHERE  FoodListing.foodListingKey = ExcludeClaimedFoodListing.foodListingKey
                  LIMIT  1
              )
        ';
    END IF;

    queryGroupAndSort := '
        GROUP BY FoodListing.foodListingKey
        ORDER BY FoodListing.availableUntilDate
        OFFSET $7
        LIMIT $8
    ';


-- ==================================== Dynamic Query Execution Phase ======================================== --
-- =========================================================================================================== --

    --raise notice '% % %', queryBase, queryFilters, queryGroupAndSort;

    -- Insert our filtered Food Listing Key - Food Listing Types pairs into our temporary table.
    EXECUTE (queryBase || queryFilters || queryGroupAndSort)
    USING _foodListingKey,
          _foodTypes,
          _perishable,
          _availableUntilDate,
          _DonatedByAppUserKey,
          _claimedByAppUserKey,
          _retrievalOffset,
          _retrievalAmount;
    

-- ==================================== Final Return Phase ======================================= --
-- =============================================================================================== --

    -- Here we will be doing a select using the filtered food listing keys from the dynamic query above. No grouping will be necessary.
    RETURN QUERY
    SELECT  FoodListing.foodListingKey,
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
            DonatedByAppUser.lastName,
            DonatedByAppUser.firstName,
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

--select * FROM getFoodListings(0, 1000);

/*

select getFoodListings(0, 25, 1);

select getFoodListings(0, 25, NULL, false, '{Grain}');

select getFoodListings(0, 25, NULL, false, '{Meat, Drink}');

*/
