SELECT dropFunction ('updateAppUser');

/**
 * Updates a given App User.
 */
CREATE OR REPLACE FUNCTION updateAppUser
(
    _appUserKey             AppUser.appUserKey%TYPE,
    _email                  AppUser.email%TYPE                  DEFAULT NULL, 
    _password               AppUserPassword.password%TYPE       DEFAULT NULL,
    _lastName               AppUser.lastName%TYPE               DEFAULT NULL,
    _firstName              AppUser.firstName%TYPE              DEFAULT NULL,
    _address                ContactInfo.address%TYPE            DEFAULT NULL,
    _addressLatitude        ContactInfo.addressLatitude%TYPE    DEFAULT NULL,
    _addressLongitude       ContactInfo.addressLongitude%TYPE   DEFAULT NULL,
    _city                   ContactInfo.city%TYPE               DEFAULT NULL,
    _state                  ContactInfo.state%TYPE              DEFAULT NULL,
    _zip                    ContactInfo.zip%TYPE                DEFAULT NULL,
    _phone                  ContactInfo.phone%TYPE              DEFAULT NULL,
    _isDonor                AppUser.isDonor%TYPE                DEFAULT NULL,
    _isReceiver             AppUser.isReceiver%TYPE             DEFAULT NULL,
    _availabilityTimeRanges TimeRange[]                         DEFAULT NULL, -- See TimeRange type definition in app-user-availability.sql!
    _organizationName       Organization.name%TYPE              DEFAULT NULL
)
-- Returns the new App User's information.
RETURNS TABLE
(
    appUserKey  AppUser.appUserKey%TYPE,
    password    AppUserPassword.password%TYPE,
    sessionData JSON
)
AS $$
BEGIN

    -- Permorm the update on the AppUser table fields and get keys to related tables that may need updating.
    UPDATE AppUser
    SET email       = COALESCE(_email, email),
        lastName    = COALESCE(_lastName, lastName),
        firstName   = COALESCE(_firstName, firstName),
        isDonor     = COALESCE(_isDonor, isDonor),
        isReceiver  = COALESCE(_isReceiver, isReceiver)
    WHERE AppUser.appUserKey = _appUserKey;

    -- Update any ContactInfo fields related to AppUser being updated.
    UPDATE ContactInfo
    SET address             = COALESCE(_address, address),
        addressLatitude     = COALESCE(_addressLatitude, addressLatitude),
        addressLongitude    = COALESCE(_addressLongitude, addressLongitude),
        city                = COALESCE(_city, city),
        state               = COALESCE(_state, state),
        zip                 = COALESCE(_zip, zip),
        phone               = COALESCE(_phone, phone)
    WHERE ContactInfo.appUserKey = _appUserKey;

    -- Update any Organization fields related to AppUser being updated.
    IF (_organizationName IS NOT NULL)
    THEN
        UPDATE Organization
        SET name = _organizationName
        WHERE Organization.appUserKey = _appUserKey;
    END IF;

    -- Update password related to AppUser being updated. We keep track of all old passwords, so this is an insert!
    IF (_password IS NOT NULL)
    THEN
        INSERT INTO AppUserPassword (appUserKey, password)
        VALUES (_appUserKey, _password);
    END IF;

    IF (_availabilityTimeRanges IS NOT NULL)
    THEN
        PERFORM updateAvailability(_appUserKey, _availabilityTimeRanges);
    END IF;

    RETURN QUERY
    SELECT * FROM getAppUserSessionData(_appUserKey);
    
END;
$$ LANGUAGE plpgsql;

SELECT updateAppUser(1, NULL, NULL, 'Nemmer');
--SELECT * FROM appUser;
