-- DO NOT RUN THIS IF WE HAVE VALID DATA IN THE TABLES!!!
DELETE FROM FoodListing;
DELETE FROM FoodType;
DELETE FROM AppUser;
DELETE FROM Donor;
DELETE FROM Receiver;


-- Fill Donor with junk data --
INSERT INTO Donor ( donorOrganization )
VALUES ( 'Wegmans' ),
       ( 'Walmart' ),
       ( 'Target' ),
       ( 'Tops' );

SELECT * FROM Donor;


-- Fill Receiver with junk data --
INSERT INTO Receiver ( receiverOrganization )
VALUES ( 'St. Lukes' ),
       ( 'St. Gregs' ),
       ( 'St. Philips' );

SELECT * FROM Receiver;


-- Fill AppUser with junk data --
INSERT INTO AppUser ( appUserEmail, appUserPassword, userName, appUserLastName, appUserFirstName, donorKey, receiverKey )
VALUES ( 'marknemm1@buffalo.edu', 'password','markiese', 'Nemmer', 'Mark', (SELECT donorKey FROM Donor WHERE donorOrganization = 'Wegmans'), null ),
       ( 'johnnemm2@buffalo.edu', 'password','toilet', 'Nemmer', 'John', null, (SELECT receiverKey FROM Receiver WHERE receiverOrganization = 'St. Gregs') ),
       ( 'bethnemm3@buffalo.edu', 'password','potato', 'Nemmer', 'Bethany', null, null ),
       ( 'laurnemm4@buffalo.edu', 'password','aLaura', 'Nemmer', 'Laura', null, null ),
       ( 'jessnemm5@buffalo.edu', 'password','jDizzle', 'Nemmer', 'Jessalyn', null, null ),
       ( 'akasgosh@buffalo.edu', 'password','amazingHumanPerson', 'Gose', 'Akash', null, null );

SELECT * FROM AppUser;


-- Fill FoodType with junk data --
INSERT INTO FoodType ( foodTypeDescription )
VALUES ( 'Pasta' ),
       ( 'Bread' ),
       ( 'Dairy' );

SELECT * FROM FoodType;


-- Fill FoodListing with junk data --
INSERT INTO FoodListing ( foodTypeKey, perishable, postedByAppUserKey, foodDescription, expireDate, postDate )
VALUES ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Pasta'), true,
         (SELECT appUserKey FROM AppUser WHERE appuserLastName = 'Nemmer' AND appuserFirstName = 'Mark'), 'Mmmm, yummy yummy!!!', now() + INTERVAL '10 day', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Bread'), false,
         (SELECT appUserKey FROM AppUser WHERE appuserLastName = 'Nemmer' AND appuserFirstName = 'Mark'), 'Nice and stale!!!', now() + INTERVAL '10 week', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Dairy'), true,
         (SELECT appUserKey FROM AppUser WHERE appuserLastName = 'Nemmer' AND appuserFirstName = 'Mark'), 'Chunky chunky!', now(), now() );

SELECT * FROM FoodListing;
