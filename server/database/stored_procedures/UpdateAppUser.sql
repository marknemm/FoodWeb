/*
    Based on the existence of a user,
    this procedure should either UPDATE
    or create a AppUser */

/* The dropFucntion clears all prior copies of a function to
   avoid conflict.*/
SELECT dropFunction ('updateappuser');

/* In order update existing user info, or to create a new user,
    you shall need to provide the userEmail, Password, LastName
    and FirstName.*/

CREATE OR REPLACE FUNCTION updateAppUser
(
    newUser                 BOOLEAN             DEFAULT NULL,
    _userName               VARCHAR(128)        DEFAULT NULL,
    _appUserEmail           VARCHAR(128)        DEFAULT NULL, 
    _appUserPassword        TEXT                DEFAULT NULL,
    _appUserLastName        VARCHAR(60)         DEFAULT NULL,
    _appUserFirstName       VARCHAR(60)         DEFAULT NULL
    
)
RETURNS VOID
AS $$
    --DECLARE newUser BOOLEAN = FALSE;
    DECLARE _appUserKey INTEGER;

/* If new user, then simply insertIntoAppUser
   Else get appUserKey, and Update ALL
   Info on that row with new, non-null info */ 
BEGIN
    raise notice 'Values: %, %, %, %, %', _userName, _appUserEmail, _appUserPassword, _appUserLastName, _appUserFirstName;
    CASE
        WHEN newUser = true
            THEN PERFORM insertIntoAppUser(_appUserEmail, _appUserPassword,
                                            _appUserLastName, _appUserFirstName );
        WHEN newUser = false 
           THEN  _appUserKey = (SELECT appUserKey FROM appUser 
                            WHERE(_userName IS NOT NULL AND userName = _userName) OR (_appUserEmail IS NOT NULL AND appUserEmail = _appUserEmail));
                            raise notice 'Value: %', _appUserKey;
            UPDATE AppUser
            SET appUserEmail = COALESCE(_appUserEmail, appUserEmail),
                appUserPassword = COALESCE(_appUserPassword, appUserPassword),
                appUserLastName = COALESCE(_appUserLastName, appUserLastName),
                appUserFirstName = COALESCE(_appUserFirstName, appUserFirstName)
            WHERE appUserKey = _appUserKey; 
    END CASE; 


END;
$$ LANGUAGE plpgsql;

--SELECT * FROM appUser;
--SELECT updateAppUser(TRUE, 'testUser3@test.edu', 'password', 'User3', 'Test3');
SELECT updateAppUser (FALSE,'amazingHumanPerson', 'aghose@buffalo.edu', 'password', 'Ghose', 'Akash');
SELECT * FROM appUser;
