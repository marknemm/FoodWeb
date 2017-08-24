SELECT dropFunction ('updateAppUser');

-- In order update existing user, you shall need to provide the userEmail, Password, LastName, and FirstName.
CREATE OR REPLACE FUNCTION updateAppUser
(
    _email          VARCHAR(128)        DEFAULT NULL, 
    _password       CHAR(60)            DEFAULT NULL,
    _lastName       VARCHAR(60)         DEFAULT NULL,
    _firstName      VARCHAR(60)         DEFAULT NULL
)
RETURNS INTEGER -- Returns the appUserKey
AS $$
    DECLARE _appUserKey INTEGER; 
BEGIN

    -- Permorm the update and get the appUserKey of the updated AppUser.
    UPDATE AppUser
    SET email = COALESCE(_email, email),
        password = COALESCE(_password, password),
        lastName = COALESCE(_lastName, lastName),
        firstName = COALESCE(_firstName, firstName)
    WHERE (_email IS NOT NULL AND email = _email)
    RETURNING AppUser.appUserKey INTO _appUserKey;
    
    RETURN _appUserKey;

END;
$$ LANGUAGE plpgsql;

SELECT updateAppUser ('amazingHumanPerson', 'aghose@buffalo.edu', 'password', 'Ghose', 'Akash');
SELECT * FROM appUser;
