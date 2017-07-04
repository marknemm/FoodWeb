/**
 * A basic search function for retrieving food listings that meet specific criteria.
 */
 SELECT dropFunction('searchfoodlisting');
CREATE OR REPLACE FUNCTION searchFoodListing
(
    _foodListingKey         INTEGER         DEFAULT NULL,   -- This is for when we are looking for a specific Food Listing.
    _foodTypeKey            INTEGER         DEFAULT NULL,   -- This is when we have a selection from a Food Type Combo Box.
    _perishable             BOOLEAN         DEFAULT NULL,   -- Are we looking for perishable food?
    _donorOrganizationName  VARCHAR(128)    DEFAULT NULL,   -- Are we looking for food from a specific organization?
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
    INNER JOIN DonorOrganization    ON AppUser.donorOrganizationKey = DonorOrganization.donorOrganizationKey
    WHERE (_foodListingKey IS NULL          OR FoodListing.foodListingKey = _foodListingKey)
      AND (_foodTypeKey IS NULL             OR FoodType.foodTypeKey = _foodTypeKey)
      AND (_perishable IS NULL              OR FoodListing.perishable = _perishable)
      AND (_donorOrganizationName IS NULL   OR DonorOrganization.name = _donorOrganizationName)
      AND (_earliestExpireDate IS NULL      OR FoodListing.expireDate >= TO_TIMESTAMP(_earliestExpireDate, 'MM/DD/YYYY'))
    ORDER BY FoodListing.expireDate ASC;

END;
$$ LANGUAGE plpgsql;

-- Test the Stored Procedure here --

/*
select searchFoodListing();

select searchFoodListing(1);

select searchFoodListing(NULL, (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Bread'));

select searchFoodListing(2, (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Bread'));

select searchFoodListing(NULL, NULL, true);

select searchFoodListing(NULL, NULL, NULL, 'Wegmans');

select searchFoodListing(NULL, NULL, NULL, NULL, '7/1/2017');
*/
