
SELECT dropFunction('addAppUser');

CREATE OR REPLACE FUNCTION addAppUser
(
    _email                  VARCHAR(128), 
    _password               CHAR(60),
    _lastName               VARCHAR(60),
    _firstName              VARCHAR(60),
    _address                VARCHAR(128),
    _addressLatitude        NUMERIC(7, 4),
    _addressLongitude       NUMERIC(7, 4),
    _city                   VARCHAR(60),
    _state                  CHAR(2),
    _zip                    INTEGER,
    _phone                  CHAR(12),
    _isDonor                BOOLEAN,
    _isReceiver             BOOLEAN,
    _organizationName       VARCHAR(128)    DEFAULT NULL
)
-- Returns the new App User's key and associated Organization key.
RETURNS TABLE
(
    appUserKey      INTEGER,
    organizationKey INTEGER
)
AS $$
    DECLARE _appUserKey             INTEGER         DEFAULT NULL;
    DECLARE _appUserPasswordKey     INTEGER         DEFAULT NULL;
    DECLARE _contactInfoKey         INTEGER         DEFAULT NULL;
    DECLARE _organizationKey        INTEGER         DEFAULT NULL;
BEGIN

    -- First, ensure that email does not already exist!
    IF EXISTS(SELECT 1 FROM AppUser WHERE email = _email LIMIT 1)
    THEN
        RAISE EXCEPTION 'Duplicate email provided';
    END IF;

    -- Ensure that we are giving donor or receiver capabilities to new user (cannot have neither).
    IF (_isDonor = FALSE AND _isReceiver = FALSE)
    THEN
        _isReceiver := TRUE; -- If neither, then default to receiver.
    END IF;
    
    -- Add the new user's contact info and get reference to entry.
    SELECT * INTO _contactInfoKey FROM addContactInfo (_address, _addressLatitude, _addressLongitude, _city, _state, _zip, _phone);

    -- Add the new user's password and get reference to entry.
    INSERT INTO AppUserPassword (password)
    VALUES (_password)
    RETURNING AppUserPassword.appUserPasswordKey INTO _appUserPasswordKey;

    -- Add the new user's organization data if the user is and oragnization, and get a reference to the entry.
    IF (_organizationName IS NOT NULL)
    THEN
        INSERT INTO Organization (name)
        VALUES (_organizationName)
        RETURNING Organization.organizationKey INTO _organizationKey;
    END IF;

    -- Add the new user and get reference to entry.
    INSERT INTO AppUser (email, appUserPasswordKey, contactInfoKey, organizationKey, lastName, firstName, isDonor, isReceiver)                  
    VALUES (_email, _appUserPasswordKey, _contactInfoKey, _organizationKey, _lastName, _firstName, _isDonor, _isReceiver)
    RETURNING AppUser.appUserKey INTO _appUserKey;

    RETURN QUERY
    SELECT _appUserKey, _organizationKey;

END;
$$ LANGUAGE plpgsql;

SELECT addAppUser('testemail1@test.com', 'testPass', 'testLast', 'testFirst', '11 test rd.', 43.123456, 83.33, 'Test City', 'NY', 12345, '777-777-7777', true, true);
