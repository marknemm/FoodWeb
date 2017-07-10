/*
 * This is similar to LogIn.sql, except it uses the appKey directly
 */


SELECT dropFunction('login');
CREATE OR REPLACE FUNCTION login
(
    _appUserKey         INTEGER    DEFAULT NULL, -- This will either be username or email.
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
    WHERE   (   AppUser.appUserKey = _appUserKey)
      AND   AppUser.password = _password;
END;
$$ LANGUAGE plpgsql;
