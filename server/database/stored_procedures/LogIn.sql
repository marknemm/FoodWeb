/*This SP should, given a userName or email, search the AppUser TABLE 
    for the given user. If user is not found, it will return NULL. If user is found, 
    it will then check the password. If passwrod does not match, it will return NULL, 
    else, it will return the appUserKey, username, and email for the given user*/ 

SELECT dropFunction('login');
CREATE OR REPLACE FUNCTION login
(
    _identifier         VARCHAR(128)    DEFAULT NULL, -- This will either be username or email.
    _password           TEXT            DEFAULT NULL  -- This should be the salted hash of the password supplied by the user.
)
RETURNS TABLE
(
    appUserKey     INTEGER,
    username       VARCHAR(128),
    email          VARCHAR(128)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT  AppUser.appUserKey,
            AppUser.username,
            AppUser.email
    FROM    AppUser
    WHERE   (   AppUser.username = _identifier
             OR AppUser.email = _identifier)
      AND   AppUser.password = _password;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM AppUser;
--SELECT login('marknemm1@buffalo.edu', 'password');