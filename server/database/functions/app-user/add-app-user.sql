
SELECT dropFunction('addAppUser');

CREATE OR REPLACE FUNCTION addAppUser
(
    _email                  AppUser.email%TYPE, 
    _password               AppUserPassword.password%TYPE,
    _lastName               AppUser.lastName%TYPE,
    _firstName              AppUser.firstName%TYPE,
    _address                ContactInfo.address%TYPE,
    _addressLatitude        ContactInfo.addressLatitude%TYPE,
    _addressLongitude       ContactInfo.addressLongitude%TYPE,
    _city                   ContactInfo.city%TYPE,
    _state                  ContactInfo.state%TYPE,
    _zip                    ContactInfo.zip%TYPE,
    _phone                  ContactInfo.phone%TYPE,
    _isDonor                AppUser.isDonor%TYPE,
    _isReceiver             AppUser.isReceiver%TYPE,
    _availabilityTimeRanges TimeRange[]                 DEFAULT NULL, -- See TimeRange type definition in app-user-availability.sql!
                                                                      -- **** TODO: Get rid of DEFAULT NULL once we fully implement signup with time ranges!!!
    _organizationName       Organization.name%TYPE      DEFAULT NULL
)
-- Returns the new App User's information.
RETURNS TABLE
(
    appUserKey  AppUser.appUserKey%TYPE,
    password    AppUserPassword.password%TYPE,
    sessionData JSON
)
AS $$
    DECLARE _appUserKey         AppUser.appUserKey%TYPE;
    DECLARE _verificationToken  UnverifiedAppUser.verificationToken%TYPE;
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
    SELECT * FROM getAppUserSessionData(_appUserKey);

END;
$$ LANGUAGE plpgsql;


/*
SELECT * FROM addAppUser('testemail6@test.com', 'testPass', 'testLast', 'testFirst', '11 test rd.',
                         43.123456, 83.33, 'Test City', 'NY', 12345, '777-777-7777', true, true, '{"(Monday, 11:00 AM, 3:00 PM)"}'::TimeRange[]);
*/
