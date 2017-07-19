
SELECT dropFunction('insertIntoAppUser');

CREATE OR REPLACE FUNCTION insertIntoAppUser
(
    _username   VARCHAR(128),
    _email      VARCHAR(128), 
    _password   CHAR(60),
    _lastName   VARCHAR(60),
    _firstName  VARCHAR(60)
)
RETURNS INTEGER -- Returns the new AppUser's appUserKey
AS $$
    DECLARE _appUserKey INTEGER;
BEGIN

    INSERT INTO AppUser (username, email, password, lastName, firstName)
    VALUES (_username, _email, _password, _lastName, _firstName)
    RETURNING appUserKey INTO _appUserKey;

    RETURN _appUserKey;

END;
$$ LANGUAGE plpgsql;

SELECT insertIntoAppUser('testusername', 'testUser@test.edu', 'password', 'User', 'Test');
SELECT * FROM appUser; 
