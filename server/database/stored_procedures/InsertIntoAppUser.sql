
SELECT dropFunction('updateappuser');

CREATE OR REPLACE insertIntoAppUser
(
    _appUserEmail           VARCHAR(128)        DEFAULT NULL, 
    _appUserPassword        TEXT                DEFAULT NULL,
    _appUserLastName        VARCHAR(60)         DEFAULT NULL,
    _appUserFirstName       VARCHAR(60)         DEFAULT NULL,
)
AS $$
   
BEGIN

    INSERT INTO AppUser (appUserEmail, appUserPassword,
                         appUserLastName, appUserFirstName)
    SELECT _appUserEmail, _appUserPassword, _appUserLastName, _appUserFirstName;


END;
$$ LANGUAGE plpgsql;
