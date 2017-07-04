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
    _newUser        BOOLEAN             DEFAULT NULL,
    _username       VARCHAR(128)        DEFAULT NULL,
    _email          VARCHAR(128)        DEFAULT NULL, 
    _password       TEXT                DEFAULT NULL,
    _lastName       VARCHAR(60)         DEFAULT NULL,
    _firstName      VARCHAR(60)         DEFAULT NULL
    
)
RETURNS VOID
AS $$
    DECLARE _appUserKey INTEGER;

/* If new user, then simply insertIntoAppUser
   Else get appUserKey, and Update ALL
   Info on that row with new, non-null info */ 
BEGIN
    raise notice 'Values: %, %, %, %, %', _username, _email, _password, _lastName, _firstName;
    CASE
        WHEN _newUser = true
            THEN PERFORM insertIntoAppUser(_username, _email, _password,
                                           _lastName, _firstName );
        WHEN _newUser = false 
            THEN  _appUserKey = (SELECT appUserKey FROM AppUser 
                                 WHERE(_userName IS NOT NULL AND username = _username) OR (_email IS NOT NULL AND email = _email));
            raise notice 'Value: %', _appUserKey;
            UPDATE AppUser
            SET email = COALESCE(_email, email),
                password = COALESCE(_password, password),
                lastName = COALESCE(_lastName, lastName),
                firstName = COALESCE(_firstName, firstName)
            WHERE appUserKey = _appUserKey; 
    END CASE; 


END;
$$ LANGUAGE plpgsql;

--SELECT * FROM appUser;
--SELECT updateAppUser(TRUE, 'testUser3@test.edu', 'password', 'User3', 'Test3');
SELECT updateAppUser (FALSE,'amazingHumanPerson', 'aghose@buffalo.edu', 'password', 'Ghose', 'Akash');
SELECT * FROM appUser;
