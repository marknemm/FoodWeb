/**
 * A basic search function for retrieving food listings that meet specific criteria.
 */
SELECT dropFunction('getFoodListings');
CREATE OR REPLACE FUNCTION getFoodListings
(
    _retrievalOffset            INTEGER,                        -- The offof records that should be retrieved.
    _retrievalAmount            INTEGER,                        -- The number of records that should be retrieved starting at _retrievalOffset.
    _foodListingKey             INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _unclaimedOnly              BOOLEAN         DEFAULT FALSE,  -- to true if only unclaimed results should come back.
    _foodTypes                  VARCHAR(60)[]   DEFAULT NULL,   -- This is when we may be filtering by one or many food types. Null is for all food types.
    _perishable                 BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food? Input true for perishable only, false for non-perishable, and null for both.
    _earliestExpireDate         TEXT            DEFAULT NULL,   -- Do we require food that is going to expire after a specific date? Must be in the format MM/DD/YYYY!
    _postedByAppUserKey         INTEGER         DEFAULT NULL,   -- App User key of the logged in AppUser who is trying to view the items they posted for donation.
    _claimedByAppUserKey        INTEGER         DEFAULT NULL,   -- App User key of the logged in AppUser who is trying to view the items they claimed.
    _postedByOrganizationKey    INTEGER         DEFAULT NULL,   -- Organization key to filter by. The organization will be the one that posted or donated the item.
    _claimedByOrganizationKey   INTEGER         DEFAULT NULL,   -- Organization key to filter by. The organization will be the one that claimed or is to receive the item.
    _postedByOrganizationName   VARCHAR(128)    DEFAULT NULL,   -- Are we looking for food associated with a specific organization (by name) that posted the item.
    _claimedByOrganizationName  VARCHAR(128)    DEFAULT NULL    -- Are wo looking for food associated with a specific organization (by name) that claimed the item.
)
RETURNS TABLE
(
    foodListingKey              INTEGER,
    foodTypes                   VARCHAR(60)[],
    perishable                  BOOLEAN,
    postedByOrganizationName    VARCHAR(128),
    postedByOrganizationAddress VARCHAR(128),
    postedByOrganizationCity    VARCHAR(60),
    postedByOrganizationState   CHAR(2),
    postedByOrganizationZip     INTEGER,
    postedByLastName            VARCHAR(60),
    postedByFirstName           VARCHAR(60),
    expireDate                  TEXT,
    foodDescription             TEXT,
    imgUrl                      TEXT
)
AS $$
    DECLARE queryBase           VARCHAR(2000);
    DECLARE queryFilters        VARCHAR(2000);
    DECLARE queryGroupAndSort   VARCHAR(2000);
BEGIN

    -- We will fill this table with our filtered food listings and associated food types (in aggregate array form).
    CREATE TEMP TABLE FiltFoodListingsAndTypes
    (
        foodListingKey  INTEGER PRIMARY KEY,
        foodTypes       VARCHAR(60)[]
    );

-- ==================================== Dynamic Query Generation Phase ======================================= --
-- =========================================================================================================== --

    -- We will pull back the filtered aggregate food listing keys. This query, without the group by aggregate,
    -- would pull back rows that have duplicate values for each member other than the food type column(s).
    queryBase := '
        INSERT INTO FiltFoodListingsAndTypes
        (
            foodListingKey,
            foodTypes
        )
        SELECT
            FoodListing.foodListingKey,
            ARRAY_AGG(FoodType.foodType) AS foodTypes -- Concatenates the food types into an array { Type1, Type2, ..., TypeN }
        FROM FoodListing
        INNER JOIN FoodListingFoodTypeMap   ON FoodListing.foodListingKey = FoodListingFoodTypeMap.foodListingKey
        INNER JOIN FoodType                 ON FoodListingFoodTypeMap.foodTypeKey = FoodType.foodTypeKey
    ';

    queryFilters := '
        WHERE ($1 IS NULL   OR FoodListing.foodListingKey = $1)
          -- We will translate the list of food type descriptions into integer keys for lookup efficiency.
          AND ($2 IS NULL   OR FoodType.foodTypeKey IN (SELECT  FoodType.foodTypeKey
                                                        FROM    FoodType
                                                        WHERE   FoodType.foodType = ANY($2)))
          AND ($3 IS NULL   OR FoodListing.perishable = $3)
          AND ($4 IS NULL   OR FoodListing.expireDate >= TO_TIMESTAMP($4, ''MM/DD/YYYY''))
    ';

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

     -- Do we have any fitlers related to donor/poster?
    IF (   _postedByAppUserKey IS NOT NULL
        OR _postedByOrganizationKey IS NOT NULL
        OR _postedByOrganizationName IS NOT NULL)
    THEN
        
        queryBase := queryBase || '
            INNER JOIN AppUserOrganizationMap AS PostByAppUserOrgMap    ON FoodListing.postedByKey = PostByAppUserOrgMap.appUserOrganizationMapKey
        ';

        queryFilters := queryFilters || '
              AND ($5 IS NULL OR $5 = PostByAppUserOrgMap.appUserKey)
              AND ($6 IS NULL OR $6 = PostedByAppUserOrgMap.organizationKey)
        ';

        -- Are we specifically dealing with filters realted to Posting Organization's name?
        IF (_postedByOrganizationName IS NOT NULL)
        THEN
            queryBase := queryBase || '
                INNER JOIN Organization AS PostByOrg  ON PostByAppUserOrgMap.organizationKey = PostByOrg.organizationKey
            ';

            queryFilters := queryFilters || '
                  AND ($7 = PostByOrg.name)
            ';
        END IF;

    END IF;

    -- Do we have any filters pertaining to receiver/claimer?
    IF (   _claimedByAppUserKey IS NOT NULL
        OR _claimedByOrganizationKey IS NOT NULL
        OR _claimedByOrganizationName IS NOT NULL)
    THEN

        queryBase := queryBase || '
            INNER JOIN ClaimedFoodListing                               ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
            INNER JOIN AppUserOrganizationMap AS ClaimByAppUserOrgMap   ON ClaimedFoodListing.claimedByKey = ClaimByAppUserOrgMap.appUserOrganizationMapKey
        ';
        
        queryFilters := queryFilters || '
              AND ($8 IS NULL OR $8 = ClaimByAppUserOrgMap.appUserKey)
              AND ($9 IS NULL OR $9 = ClaimByAppUserOrgMap.organizationKey)
        ';

        -- Are we specifically dealing with filters realted to Organization that is the poster of an item?
        IF (_claimedByOrganizationName IS NOT NULL)
        THEN
            queryBase := queryBase || '
                INNER JOIN Organization AS ClaimByOrg  ON ClaimByAppUserOrgMap.organizationKey = ClaimByOrg.organizationKey
            ';

            queryFilters := queryFilters || '
                  AND ($10 = ClaimByOrg.name)
            ';
        END IF;

    END IF;

    queryGroupAndSort := '
        GROUP BY FoodListing.foodListingKey
        ORDER BY FoodListing.expireDate
        OFFSET $11
        LIMIT $12
    ';


-- ==================================== Dynamic Query Execution Phase ======================================== --
-- =========================================================================================================== --

    raise notice '% % %', queryBase, queryFilters, queryGroupAndSort;

    -- Insert our filtered Food Listing Key - Food Listing Types pairs into our temporary table.
    EXECUTE (queryBase || queryFilters || queryGroupAndSort)
    USING _foodListingKey,
          _foodTypes,
          _perishable,
          _earliestExpireDate,
          _postedByAppUserKey,
          _postedByOrganizationKey,
          _postedByOrganizationName,
          _claimedByAppUserKey,
          _claimedByOrganizationKey,
          _claimedByOrganizationName,
          _retrievalOffset,
          _retrievalAmount;
    

-- ==================================== Final Return Phase ======================================= --
-- =============================================================================================== --

    -- Here we will be doing a select using the filtered food listing keys from the dynamic query above. No grouping will be necessary.
    RETURN QUERY
    SELECT  FoodListing.foodListingKey,
            FiltFoodListingsAndTypes.foodTypes,
            FoodListing.perishable,
            PostByOrg.name,
            PostByOrgContact.address,
            PostByOrgContact.city,
            PostByOrgContact.state,
            PostByOrgContact.zip,
            PostByAppUser.lastName,
            PostByAppUser.firstName,
            TO_CHAR(FoodListing.expireDate, 'MM/DD/YYYY'),
            FoodListing.foodDescription,
            FoodListing.imgUrl
    FROM FiltFoodListingsAndTypes
    INNER JOIN FoodListing                                      ON FiltFoodListingsAndTypes.foodListingKey = FoodListing.foodListingKey
    INNER JOIN ClaimedFoodListing                               ON FoodListing.foodListingKey = ClaimedFoodListing.foodListingKey
    INNER JOIN AppUserOrganizationMap   AS PostByAppUserOrgMap  ON FoodListing.postedByKey = PostByAppUserOrgMap.appUserOrganizationMapKey
    INNER JOIN AppUser                  AS PostByAppUser        ON PostByAppUserOrgMap.appUserKey = PostByAppUser.appUserKey
    LEFT JOIN Organization              AS PostByOrg            ON PostByAppUserOrgMap.organizationKey = PostByOrg.organizationKey
    LEFT JOIN ContactInfo               AS PostByOrgContact     ON PostByOrg.contactInfoKey = PostByOrgContact.contactInfoKey
    ORDER BY FoodListing.expireDate ASC;

END;
$$ LANGUAGE plpgsql;

-- Test the Stored Procedure here --


select getFoodListings(0, 1000);

/*

select getFoodListings(0, 25, 1);

select getFoodListings(0, 25, NULL, false, '{Grain}');

select getFoodListings(0, 25, NULL, false, '{Meat, Drink}');

*/
