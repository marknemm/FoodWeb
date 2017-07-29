/**
 * A basic search function for retrieving food listings that meet specific criteria.
 */
SELECT dropFunction('getFoodListings');
CREATE OR REPLACE FUNCTION getFoodListings
(
    _foodListingKey         INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _foodTypes              VARCHAR(60)[]   DEFAULT NULL,   -- This is when we may be filtering by one or many food types. Null is for all food types.
    _perishable             BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food? Input true for perishable only, false for non-perishable, and null for both.
    _donorOrganizationName  VARCHAR(128)    DEFAULT NULL,   -- Are we looking for food from a specific organization? Null if not.
    _earliestExpireDate     TEXT            DEFAULT NULL,   -- Do we require food that is going to expire after a specific date?
                                                            -- Must be in the format MM/DD/YYYY!
    _receiverAppUserKey     INTEGER         DEFAULT NULL    -- Key of the reciever who is claiming this listing.
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
            OrganizationInfo.name,
            OrganizationInfo.address,
            OrganizationInfo.city,
            OrganizationInfo.state,
            OrganizationInfo.zip,
            AppUser.lastName,
            AppUser.firstName,
            TO_CHAR(FoodListing.expireDate, 'MM/DD/YYYY'),
            FoodListing.foodDescription,
            FoodListing.imgUrl
    FROM FoodListing
    INNER JOIN FoodType             ON FoodListing.foodTypeKey = FoodType.foodTypeKey
    INNER JOIN AppUser              ON FoodListing.donorAppUserKey = AppUser.appUserKey
    LEFT JOIN DonorOrganization     ON AppUser.donorOrganizationKey = DonorOrganization.donorOrganizationKey
    LEFT JOIN OrganizationInfo      ON DonorOrganization.organizationInfoKey = OrganizationInfo.organizationInfoKey
    WHERE (_foodListingKey IS NULL          OR FoodListing.foodListingKey = _foodListingKey)
      -- We will translate the list of food type descriptions into integer keys for lookup efficiency.
      AND (_foodTypes IS NULL               OR FoodType.foodTypeKey = ANY (SELECT foodTypeKey
                                                                           FROM FoodType
                                                                           WHERE FoodType.foodTypeDescription = ANY(_foodTypes)))
      AND (_perishable IS NULL              OR FoodListing.perishable = _perishable)
      AND (_donorOrganizationName IS NULL   OR OrganizationInfo.name = _donorOrganizationName)
      AND (_earliestExpireDate IS NULL      OR FoodListing.expireDate >= TO_TIMESTAMP(_earliestExpireDate, 'MM/DD/YYYY'))
    ORDER BY FoodListing.expireDate ASC;
    --SELECT claimFoodListing(_foodListingKey, _receiverAppUserKey);

END;
$$ LANGUAGE plpgsql;

-- Test the Stored Procedure here --

/*
select getFoodListings();

select getFoodListings(1);

select getFoodListings(NULL, '{Grain}');

select getFoodListings(NULL, '{Meat, Drink}');

select getFoodListings(NULL, NULL, true);

select getFoodListings(NULL, NULL, NULL, 'Wegmans');

*/

select getFoodListings(NULL, NULL, NULL, NULL, '7/8/2017');

