
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
    _availabilityTimeRanges TimeRange[]     DEFAULT NULL, -- See TimeRange type definition in app-user-availability.sql!
                                                          -- **** TODO: Get rid of DEFAULT NULL once we fully implement signup with time ranges!!!
    _organizationName       VARCHAR(128)    DEFAULT NULL
)
-- Returns the new App User's key and verification token (to be sent to email).
RETURNS TABLE
(
    appUserKey          INTEGER,
    verificationToken   CHAR(20)
)
AS $$
    DECLARE _appUserKey         INTEGER;
    DECLARE _verificationToken  CHAR(20);
BEGIN

    -- First, ensure that email does not already exist (fail fast)!
    IF EXISTS(
        SELECT 1
        FROM AppUser
        WHERE email = _email
        LIMIT 1
    )
    THEN
        RAISE EXCEPTION 'Duplicate email provided';
    END IF;

    -- Ensure that we are giving donor or receiver capabilities to new user (cannot have neither).
    IF (_isDonor = FALSE AND _isReceiver = FALSE)
    THEN
        _isReceiver := TRUE; -- If neither, then default to receiver.
    END IF;

    -- Add the new user and get reference to entry.
    INSERT INTO AppUser (email, lastName, firstName, isDonor, isReceiver)                  
    VALUES      (_email, _lastName, _firstName, _isDonor, _isReceiver)
    RETURNING   AppUser.appUserKey
    INTO        _appUserKey;

    -- Add the new user's password.
    INSERT INTO AppUserPassword (appUserKey, password)
    VALUES      (_appUserKey, _password);

    -- Add the new user's contact info.
    PERFORM addContactInfo (_appUserKey, _address, _addressLatitude, _addressLongitude, _city, _state, _zip, _phone);

    -- **** TODO: Get rid of this check once we fully implement signup with time ranges!!!
    IF (_availabilityTimeRanges IS NOT NULL)
    THEN
        -- Add the new user's availability times.
        PERFORM updateAvailability (_appUserKey, _availabilityTimeRanges);
    END IF;

    -- Add the new user's organization data if the user is and oragnization.
    IF (_organizationName IS NOT NULL)
    THEN
        INSERT INTO Organization (appUserKey, name)
        VALUES      (_appUserKey, _organizationName);
    END IF;

    -- Add the new user to table of unverified app users (needs email verification) and grab generated verification token for email.
    _verificationToken := (SELECT * FROM addUnverifiedAppUser (_appUserKey));

    RETURN QUERY
    SELECT _appUserKey, _verificationToken;

END;
$$ LANGUAGE plpgsql;


/*
SELECT addAppUser('testemail1@test.com', 'testPass', 'testLast', 'testFirst', '11 test rd.',
                  43.123456, 83.33, 'Test City', 'NY', 12345, '777-777-7777', true, true, '{"(Monday, 11:00 AM, 3:00 PM)"}'::TimeRange[]);
*/
