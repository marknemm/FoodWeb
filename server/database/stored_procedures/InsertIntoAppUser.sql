
--SELECT dropFunction('updateappuser');

CREATE OR REPLACE FUNCTION insertIntoAppUser
(
    _appUserEmail           VARCHAR(128)        DEFAULT NULL, 
    _appUserPassword        TEXT                DEFAULT NULL,
    _appUserLastName        VARCHAR(60)         DEFAULT NULL,
    _appUserFirstName       VARCHAR(60)         DEFAULT NULL
)
RETURNS VOID
AS $$
BEGIN

    INSERT INTO AppUser (appUserEmail, appUserPassword,
                         appUserLastName, appUserFirstName)
    VALUES (_appUserEmail, _appUserPassword, _appUserLastName, _appUserFirstName);

END;
$$ LANGUAGE plpgsql;
--SELECT insertIntoAppUser('testUser@test.edu', 'password', 'User', 'Test');
SELECT* FROM appUser; 
