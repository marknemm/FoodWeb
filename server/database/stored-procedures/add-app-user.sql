
SELECT dropFunction('addAppUser');

CREATE OR REPLACE FUNCTION addAppUser
(
    _username               VARCHAR(128),
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
    _organizationNameKeys   VARCHAR(150)[]  DEFAULT NULL
)
RETURNS INTEGER -- Returns the new App User's key.
AS $$
    DECLARE _appUserKey             INTEGER         DEFAULT NULL;
    DECLARE _organizationKey        INTEGER         DEFAULT NULL;
    DECLARE _appUserPasswordKey     INTEGER         DEFAULT NULL;
    DECLARE _contactInfoKey         INTEGER         DEFAULT NULL;
    DECLARE _orgNameKey             VARCHAR(150)    DEFAULT NULL;
BEGIN

    -- First, ensure that the username and email do not already exist!
    IF EXISTS(SELECT 1 FROM AppUser WHERE username = _username OR email = _email)
    THEN
        RAISE EXCEPTION 'Duplicate username or email provided';
    END IF;
    
    -- Add the new user's contact info and get reference to entry.
    SELECT INTO _contactInfoKey FROM addContactInfo (_address, _addressLatitude, _addressLongitude, _city, _state, _zip, _phone);

    -- Add the new user's password and get reference to entry.
    INSERT INTO AppUserPassword (password)
    VALUES (_password)
    RETURNING AppUserPassword.appUserPasswordKey INTO _appUserPasswordKey;

    -- Add the new user and get reference to entry.
    INSERT INTO AppUser (username, email, appUserPasswordKey, lastName, firstName)                  
    VALUES (_username, _email, _appUserPasswordKey, _lastName, _firstName)
    RETURNING AppUser.appUserKey INTO _appUserKey;

    -- Insert an individual entry for a new user designating them as their own receiving entity.
    INSERT INTO AppUserOrganizationMap (appUserKey, organizationKey, registrationPending, registrationConfirmDate, administrator)
    VALUES (_appUserKey, NULL, TRUE, CURRENT_TIMESTAMP, TRUE);

    -- Associate new user with each organization that they wish to register with. Their membership will need to be confirmed by an admin!
    IF (_organizationNameKeys IS NOT NULL)
    THEN
        FOREACH _orgNameKey SLICE 1 IN ARRAY _organizationNameKeys
        LOOP
            -- Extract the organiztion key from each organization name-key string.
            _organizationKey = SPLIT_PART(_orgNameKey, '-', 2);
            INSERT INTO AppUserOrganizationMap (appUserKey, organizationKey)
            VALUES (_appUserKey, _organizationKey);
        END LOOP;
    END IF;

    RETURN _appUserKey;

END;
$$ LANGUAGE plpgsql;

SELECT addAppUser('testUsername', 'testemail@test.com', 'testPass', 'testLast', 'testFirst', '11 test rd.', 43.123456, 83.33, 'Test City', 'NY', 12345, '777-777-7777');
