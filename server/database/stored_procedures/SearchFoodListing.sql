/**
 * A basic search function for retrieving food listings that meet specific criteria.
 */
 SELECT dropFunction('searchfoodlisting');
CREATE OR REPLACE FUNCTION searchFoodListing
(
    _foodListingKey         INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _foodTypes              VARCHAR(60)[]   DEFAULT NULL,   -- This is when we may be filtering by one or many food types. Null is for all food types.
    _perishable             BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food? Input true for perishable only, false for non-perishable, and null for both.
    _donorOrganizationName  VARCHAR(128)    DEFAULT NULL,   -- Are we looking for food from a specific organization? Null if not.
    _earliestExpireDate     TEXT            DEFAULT NULL    -- Do we require food that is going to expire after a specific date?
                                                            -- Must be in the format MM/DD/YYYY!
)
RETURNS TABLE
(
    foodListingKey              INTEGER,
    foodTypeDescription         VARCHAR(128),
    perishable                  BOOLEAN,
    donorOrganizationName       VARCHAR(128),
    donorOrganizationAddress    VARCHAR(128),
    donorOrganizationCity       VARCHAR(60),
    donorOrganizationState      CHAR(2),
    donorOrganizationZip        INTEGER,
    donorLastName               VARCHAR(60),
    donorFirstName              VARCHAR(60),
    expireDate                  TEXT,
    foodDescription             TEXT,
    imgUrl                      TEXT
)
AS $$
BEGIN

    RETURN QUERY
    SELECT  FoodListing.foodListingKey,
            FoodType.foodTypeDescription,
            FoodListing.perishable,
            DonorOrganization.name,
            DonorOrganization.address,
            DonorOrganization.city,
            DonorOrganization.state,
            DonorOrganization.zip,
            AppUser.lastName,
            AppUser.firstName,
            TO_CHAR(FoodListing.expireDate, 'MM/DD/YYYY'),
            FoodListing.foodDescription,
            FoodListing.imgUrl
    FROM FoodListing
    INNER JOIN FoodType             ON FoodListing.foodTypeKey = FoodType.foodTypeKey
    INNER JOIN AppUser              ON FoodListing.postedByAppUserKey = AppUser.appUserKey
    LEFT JOIN DonorOrganization     ON AppUser.donorOrganizationKey = DonorOrganization.donorOrganizationKey
    WHERE (_foodListingKey IS NULL          OR FoodListing.foodListingKey = _foodListingKey)
      -- We will translate the list of food type descriptions into integer keys for lookup efficiency.
      AND (_foodTypes IS NULL               OR FoodType.foodTypeKey = ANY (SELECT foodTypeKey
                                                                           FROM FoodType
                                                                           WHERE FoodType.foodTypeDescription = ANY(_foodTypes)))
      AND (_perishable IS NULL              OR FoodListing.perishable = _perishable)
      AND (_donorOrganizationName IS NULL   OR DonorOrganization.name = _donorOrganizationName)
      AND (_earliestExpireDate IS NULL      OR FoodListing.expireDate >= TO_TIMESTAMP(_earliestExpireDate, 'MM/DD/YYYY'))
    ORDER BY FoodListing.expireDate ASC;

END;
$$ LANGUAGE plpgsql;

-- Test the Stored Procedure here --

/*select searchFoodListing();

select searchFoodListing(1);

select searchFoodListing(NULL, '{Grain}');

select searchFoodListing(NULL, '{Meat, Drink}');

select searchFoodListing(NULL, NULL, true);

select searchFoodListing(NULL, NULL, NULL, 'Wegmans');

select searchFoodListing(NULL, NULL, NULL, NULL, '7/1/2017');*/
