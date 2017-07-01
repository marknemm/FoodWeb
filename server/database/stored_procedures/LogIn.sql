/*This SP should, given a userName or email, search the AppUser TABLE 
    for the given user. If user is not found, it will return NULL. If user is found, 
    it will then check the password. If passwrod does not match, it will return NULL, 
    else, it will return the appUserKey for the given user*/ 

SELECT dropFunction('login');
CREATE OR REPLACE FUNCTION login
(
    _identifier         VARCHAR(128)        DEFAULT NULL,
    _password           TEXT                DEFAULT NULL
)
RETURNS INTEGER
AS $$
    DECLARE returnKey INTEGER;
    DECLARE storedPassword TEXT;
BEGIN

    returnKey := (SELECT appUserKey FROM appUser WHERE _identifier = userName OR _identifier = appUserEmail);
    IF returnKey IS NOT NULL THEN
        storedPassword := (SELECT appUserPassword FROM appUser WHERE returnKey = appUserKey);
        IF _password = storedPassword THEN
            RETURN returnKey;
        END IF;
    END IF;

    -- We could not match username and password.
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

SELECT login('marknemm1@buffalo.edu', 'password');