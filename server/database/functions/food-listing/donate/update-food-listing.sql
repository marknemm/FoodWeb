/**
 * A basic function for updating a food listing.
 * NOTE: Any arguments of NULL will be interpreted as * no update *!
 */
SELECT dropFunction('updateFoodListing');
CREATE OR REPLACE FUNCTION updateFoodListing
(
    _foodListingKey         INTEGER,                        -- The key identifier of the Food Listing to update.
    _donatedByAppUserKey    INTEGER,                        -- The Donor ID (used to check if user has rights to update Food Listing).
    _foodTypes              FoodType[]      DEFAULT NULL,   -- What Food Types is this?
    _foodTitle              VARCHAR(100)    DEFAULT NULL,   -- The title (short description) of the Food Listing.
    _perishable             BOOLEAN         DEFAULT NULL,   -- Is the food perishable?
    _availableUntilDate     TEXT            DEFAULT NULL,   -- The date when the donated food will no longer be available.
    _totalWeight            INTEGER         DEFAULT NULL,   -- The total weight of (all parts/units of) the Food Listing (in pounds).
    _foodDescription        TEXT            DEFAULT NULL,   -- A (long) description of the Food Listing.
    _imgURL                 TEXT            DEFAULT NULL,   -- URL for the image being stored/uploaded.
    _donorOnHandUnitsCount  INTEGER         DEFAULT 1,      /* The number of parts/units that the Food Listing is split up into which are currently
                                                               in the physical possetion of the donor (both claimed and available, but not deliver state). */
    _unitsLabel             TEXT            DEFAULT NULL    -- The user provided label for each unit.
)
RETURNS VOID -- TODO: Return data pertaining to contacts of Receivers (Claimers) who are negatively effected by this update (for contacting them)!
AS $$
    DECLARE _deltaDonorOnHandUnitsCount     INTEGER;
    DECLARE _availableUntilTimeStamp        TIMESTAMP;
BEGIN

    -- ============ Ensure user is authorized to update Food Listing ============ --
    -- ========================================================================== --

    IF NOT EXISTS (
        SELECT 1 FROM   FoodListing
        WHERE           foodListingKey = _foodListingKey
          AND           donatedByAppUserKey = _donatedByAppUserKey
    )
    THEN
        RAISE EXCEPTION 'Either the food listing does not exist, or user not authorized.';
    END IF;


    -- ===================== Handle number of units update ====================== --
    -- ========================================================================== --

    -- If units count is being updated, we must check if it is updated to a valid number.
    -- An increase is not a problem, but a decrease may put data in an inconsistent state.
    IF (_unitsCount IS NOT NULL)
    THEN
        
        _deltaDonorOnHandUnitsCount := _donorOnHandUnitsCount - (SELECT getDonorOnHandUnitsCount(_foodListingKey));

        -- If we have a negative change, then attempt to delete the number of units in the change.
        IF (_deltaDonorOnHandUnitsCount < 0)
        THEN

            -- TODO: Gather a temp table result from this function call that will contain App User info of Claimers who are affected by this action.
            -- NOTE: This function call will ensure that the units can be deleted.
            PERFORM removeFoodListing(_foodListingKey, _donorAppUserKey, -_deltaDonorOnHandUnitsCount);

        -- Else if we have a positive change, then simply add change to the available units for the associated Food Listing.
        ELSIF (_deltaDonorOnHandUnitsCount > 0)
        THEN

            UPDATE  FoodListing
            SET     availableUnitsCount = availableUnitsCount + _deltaDonorOnHandUnitsCount
            WHERE   foodListingKey = _foodListingKey;
        
        END IF;
        -- If the change in donor on hand units count is 0, then do nothing...

    END IF;


    -- =================== Handle Food Types update ====================== --
    -- =================================================================== --

    IF (_foodTypes IS NOT NULL)
    THEN

        -- First delete all associated Food Types.
        DELETE FROM FoodListingFoodTypeMap
        WHERE       foodListingKey = _foodListingKey;

        -- TODO: Get the removed Food Types in this update and notify App Users that have non-delivered claims that they were removed.

        -- Then add Food Types provided in the update (includes any old Food Types that were not removed by the user).
        FOR i IN array_lower(_foodTypes, 1) .. array_upper(_foodTypes, 1)
        LOOP
            INSERT INTO FoodListingFoodTypeMap (foodListingKey, foodType)
            VALUES      (_foodListingKey, _foodTypes[i]);
        END LOOP;

    END IF;


    -- ============= Handle available until date update ============== --
    -- =============================================================== --

    /** 
     * TODO: Find the claimers (receivers) who have not yet had this Food Listing delivered.
     *       Any receivers among these whose availability does not allow a delivery before
     *       the available until date must be marked down and notified!
     */


     -- ================ Handle all remaining updates ================ --
     -- ============================================================== --

     UPDATE FoodListing
     SET    foodTitle = _foodTitle,
            perishable = _perishable,
            availableUntilDate = _availableUntilDate,
            totalWeight = _totalWeight,
            foodDescription = _foodDescription,
            imgUrl = _imgUrl,
            unitsLabel = _unitsLabel
    WHERE   FoodListing.foodListingKey = _foodListingKey;

END;
$$ LANGUAGE plpgsql;

--SELECT * FROM AppUser;
--SELECT addFoodListing(1, '{ Meal, Dairy }', 'Some food with many parts!', false, '1/2/2021', 2, 'Description of food here!', NULL, 10, 'bottles');
--SELECT * FROM FoodListing;
