
SELECT dropFunction('addAppUser');

CREATE OR REPLACE FUNCTION addAppUser
(
    _username       VARCHAR(128),
    _email          VARCHAR(128), 
    _password       CHAR(60),
    _lastName       VARCHAR(60),
    _firstName      VARCHAR(60),
    _isReceiverOrg  BOOLEAN         DEFAULT NULL,
    _isDonorOrg     BOOLEAN         DEFAULT NULL,
    _orgName        VARCHAR(128)    DEFAULT NULL,
    _address        VARCHAR(128)    DEFAULT NULL,
    _city           VARCHAR(60)     DEFAULT NULL,
    _state          CHAR(2)         DEFAULT NULL,
    _zip            INTEGER         DEFAULT NULL,
    _phone          CHAR(12)        DEFAULT NULL
)
RETURNS TABLE
(
    appUserKey                  INTEGER,
    organizationKey             INTEGER
) -- Returns the new AppUser's KEYS
AS $$
    DECLARE _appUserKey                 INTEGER     DEFAULT NULL;
    DECLARE _organizationKey            INTEGER     DEFAULT NULL;
    DECLARE _appUserPasswordKey         INTEGER     DEFAULT NULL;
    DECLARE _contactInfoKey             INTEGER     DEFAULT NULL;

BEGIN
    
    SELECT INTO _contactInfoKey FROM addContactInfo (_address, _city, _state, _zip, _phone);

    CASE
        WHEN (_isDonorOrg = TRUE OR _isReceiverOrg = TRUE) 
            THEN 
                SELECT addOrganization(_orgName, _isDonorOrg, _isReceiverOrg, _contactInfoKey) INTO _organizationKey;
        ELSE
                RAISE NOTICE 'Not associating organization with App User on Sign Up';
    END CASE;

    INSERT INTO AppUserPassword (password)
    VALUES (_password) 
    RETURNING AppUserPassword.appUserPasswordKey INTO _appUserPasswordKey;

    INSERT INTO AppUser (username, email, lastName, firstName, appUserPasswordKey )                  
    VALUES (_username, _email, _lastName, _firstName, _appUserPasswordKey)
    RETURNING AppUser.appUserKey INTO _appUserKey;

    CASE
        WHEN (_isDonorOrg = TRUE OR _isReceiverOrg = TRUE) 
            THEN 
                INSERT INTO AppUserOrganizationMap (appUserKey, organizationKey)
                VALUES (_appUserKey, _organizationKey);
    END CASE;

    RETURN QUERY
    SELECT _appUserKey, _organizationKey;

END;
$$ LANGUAGE plpgsql;

SELECT addAppUser('testUseNamead', 'tesadsft@test.com', 'testPass', 'testLast', 'testFirst', true, false, 'orgName', 'blah', 'blah', 'bl', 0, 'blah')