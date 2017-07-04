-- DO NOT RUN THIS IF WE HAVE VALID DATA IN THE TABLES!!!
DELETE FROM FoodListing;
DELETE FROM FoodType;
DELETE FROM AppUser;
DELETE FROM DonorOrganization;
DELETE FROM ReceiverOrganization;


-- Fill Donor with junk data --
INSERT INTO DonorOrganization ( name, address, city, state, zip, phone )
VALUES ( 'Wegmans', 'Sheridan Dr.', 'Williamsville', 'NY', 14221, '716-111-1111' ),
       ( 'Walmart', 'Transit Rd.', 'Williamsville', 'NY', 14221, '716-111-1112' ),
       ( 'Target' , 'Transit Rd.', 'Depew', 'NY', 14043, '716-111-1113' ),
       ( 'Tops', 'Maple Rd.', 'Williamsville', 'NY', 14221, '716-111-1114' );

SELECT * FROM DonorOrganization;


-- Fill Receiver with junk data --
INSERT INTO ReceiverOrganization ( name, address, city, state, zip, phone )
VALUES ( 'St. Lukes', 'some street', 'some city', 'NY', 14444, '716-111-1121' ),
       ( 'St. Gregs', 'some street 2', 'some city 2', 'NY', 14445, '716-111-1131' ),
       ( 'St. Philips', 'some street 3', 'some city 3', 'NY', 14446, '716-111-1141' );

SELECT * FROM ReceiverOrganization;


-- Fill AppUser with junk data --
INSERT INTO AppUser ( email, password, username, lastName, firstName, donorOrganizationKey, receiverOrganizationKey )
VALUES ( 'marknemm1@buffalo.edu', 'password','markiese', 'Nemmer', 'Mark', (SELECT donorOrganizationKey FROM DonorOrganization WHERE name = 'Wegmans'), null ),
       ( 'johnnemm2@buffalo.edu', 'password','toilet', 'Nemmer', 'John', null, (SELECT receiverOrganizationKey FROM ReceiverOrganization WHERE name = 'St. Gregs') ),
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
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark'), 'Mmmm, yummy yummy!!!', now() + INTERVAL '10 day', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Bread'), false,
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark'), 'Nice and stale!!!', now() + INTERVAL '10 week', now() ),
       ( (SELECT foodTypeKey FROM FoodType WHERE foodTypeDescription = 'Dairy'), true,
         (SELECT appUserKey FROM AppUser WHERE lastName = 'Nemmer' AND firstName = 'Mark'), 'Chunky chunky!', now(), now() );

SELECT * FROM FoodListing;
