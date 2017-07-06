
SELECT dropFunction('insertIntoAppUser');

CREATE OR REPLACE FUNCTION insertIntoAppUser
(
    _username   VARCHAR(128)        DEFAULT NULL,
    _email      VARCHAR(128)        DEFAULT NULL, 
    _password   TEXT                DEFAULT NULL,
    _salt       TEXT                DEFAULT NULL,
    _lastName   VARCHAR(60)         DEFAULT NULL,
    _firstName  VARCHAR(60)         DEFAULT NULL
)
RETURNS VOID
AS $$
BEGIN

    INSERT INTO AppUser (username, email, password,
                         salt, lastName, firstName)
    VALUES (_username, _email, _password, _salt, _lastName, _firstName);

END;
$$ LANGUAGE plpgsql;

--SELECT insertIntoAppUser('testusername', 'testUser@test.edu', 'password', 'User', 'Test');
--SELECT * FROM appUser; 
