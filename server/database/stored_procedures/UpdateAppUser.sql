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

CREATE OR REPLACE updateAppUser
(
    _appUserEmail           VARCHAR(128)        DEFAULT NULL, 
    _appUserPassword        TEXT                DEFAULT NULL,
    _appUserLastName        VARCHAR(60)         DEFAULT NULL,
    _appUserFirstName       VARCHAR(60)         DEFAULT NULL,
    newUser                 BOOLEAN             DEFAULT NULL
)
AS $$
    --DECLARE newUser BOOLEAN = FALSE;
    DECLARE _appUserKey INTEGER;

/* If new user, then simply insertIntoAppUser
   Else get donor or reciever key, and Update ALL
   Info on that row with new, non-null info */ 
BEGIN

    CASE
        WHEN newUser = true
            THEN SELECT insertIntoAppUser(_appUserEmail, _appUserPassword,
                                            _appUserLastName, _appUserFirstName )
        ELSE 
            _appUserKey = SELECT appUserKey FROM appUser 
                            WHERE (_appUserEmail != NULL AND appUserEmail = _appUserEmail) OR
                                (_appUserPassword != NULL AND appUserPassword = _appUserPassword) OR
                                (_appUserLastName != NULL AND appUserLastName = _appUserLastName) OR
                                (_appUserFirstName != NULL AND appUserFirstName = _appUserFirstName);
            UPDATE AppUser
                CASE 
                    WHEN _appUserEmail != NULL THEN SET appUserEmail = _appUserEmail
                    WHEN _appUserPassword != NULL THEN SET appUserPassword = _appUserPassword
                    WHEN _appUserLastName != NULL THEN SET appUserLastName = _appUserLastName
                    WHEN _appUserFirstName != NULL THEN SET appUserFirstName = _appUserFirstName
                END
            WHERE appUserKey = _appUserKey;
    END   


END;
$$ LANGUAGE plpgsql;

SELECT * FROM appUser;

