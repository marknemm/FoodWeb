SELECT * FROM insertIntoAppUser('markynemms', 'markynemms@buffalo.edu', 'password1', 'Nemmer', 'Mark',
                                false, true, 'Church', '67 Road', 'Buffalo', 'NY', 14421, '716-204-3334');

SELECT * FROM AppUser where appUserKey = 166;
SELECT * FROM AppUser where appUserKey = 167;

SELECT * FROM ReceiverOrganization where receiverOrganizationKey = 118;
SELECT * FROM DonorOrganization where donorOrganizationKey = 157;