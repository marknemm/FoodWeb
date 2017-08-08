
INSERT INTO FoodListing ( foodTypeKey, perishable, postedByAppUserKey, foodDescription, expireDate, postDate )
VALUES ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Meat'), true,
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark' LIMIT 1), 'Mmmm, yummy yummy!!!', now() + INTERVAL '10 day', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Grain'), false,
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark' LIMIT 1), 'Nice and stale!!!', now() + INTERVAL '10 week', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Drink'), true,
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark' LIMIT 1), 'Chunky chunky!', now(), now() );


SELECT foodListingKey FROM FoodListing;
SELECT appUserKey FROM AppUser;