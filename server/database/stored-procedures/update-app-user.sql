/*
    Based on the existence of a user,
    this procedure should either UPDATE
    or create a AppUser */

/* The dropFucntion clears all prior copies of a function to
   avoid conflict.*/
SELECT dropFunction ('updateAppUser');

/* In order update existing user info, or to create a new user,
    you shall need to provide the userEmail, Password, LastName
    and FirstName.*/

CREATE OR REPLACE FUNCTION updateAppUser
(
    _username       VARCHAR(128)        DEFAULT NULL,
    _email          VARCHAR(128)        DEFAULT NULL, 
    _password       CHAR(60)            DEFAULT NULL,
    _lastName       VARCHAR(60)         DEFAULT NULL,
    _firstName      VARCHAR(60)         DEFAULT NULL,
    _newUser        BOOLEAN             DEFAULT FALSE
)
RETURNS INTEGER -- Returns the appUserKey
AS $$
    DECLARE _appUserKey INTEGER;

/* If new user, then simply addAppUser
   Else get appUserKey, and Update ALL
   Info on that row with new, non-null info */ 
BEGIN
    CASE
        WHEN _newUser = true THEN
            RETURN addAppUser(_username, _email, _password, _lastName, _firstName);
        WHEN _newUser = false THEN
            _appUserKey = (SELECT appUserKey
                           FROM AppUser 
                           WHERE (_userName IS NOT NULL AND username = _username)
                              OR (_email IS NOT NULL AND email = _email));

            UPDATE AppUser
            SET email = COALESCE(_email, email),
                password = COALESCE(_password, password),
                lastName = COALESCE(_lastName, lastName),
                firstName = COALESCE(_firstName, firstName)
            WHERE appUserKey = _appUserKey;
            RETURN _appUserKey;
    END CASE; 

    RETURN NULL;

END;
$$ LANGUAGE plpgsql;

SELECT updateAppUser ('amazingHumanPerson', 'aghose@buffalo.edu', 'password', 'Ghose', 'Akash');
SELECT * FROM appUser;
