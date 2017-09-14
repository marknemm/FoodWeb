


SELECT
    (SELECT ARRAY_AGG(FoodType.foodType) AS foodTypes
                FROM FoodType
                INNER JOIN FoodListingFoodTypeMap ON FoodType.foodTypeKey = FoodListingFoodTypeMap.foodTypeKey AND FoodListingFoodTypeMap.foodListingKey = FoodListing.foodListingKey
                GROUP BY FoodListingFoodTypeMap.foodListingKey)

FROM FoodListing;