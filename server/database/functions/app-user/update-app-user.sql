SELECT dropFunction ('updateAppUser');

-- In order update existing user, you shall need to provide the userEmail, Password, LastName, and FirstName.
CREATE OR REPLACE FUNCTION updateAppUser
(
    _appUserKey         INTEGER,
    _email              VARCHAR(128)        DEFAULT NULL, 
    _password           CHAR(60)            DEFAULT NULL,
    _lastName           VARCHAR(60)         DEFAULT NULL,
    _firstName          VARCHAR(60)         DEFAULT NULL,
    _address            VARCHAR(128)        DEFAULT NULL,
    _addressLatitude    NUMERIC(7, 4)       DEFAULT NULL,
    _addressLongitude   NUMERIC(7, 4)       DEFAULT NULL,
    _city               VARCHAR(60)         DEFAULT NULL,
    _state              CHAR(2)             DEFAULT NULL,
    _zip                INTEGER             DEFAULT NULL,
    _phone              CHAR(12)            DEFAULT NULL,
    _isDonor            BOOLEAN             DEFAULT NULL,
    _isReceiver         BOOLEAN             DEFAULT NULL,
    _organizationName   VARCHAR(128)        DEFAULT NULL
)
RETURNS VOID
AS $$
BEGIN

    -- Permorm the update on the AppUser table fields and get keys to related tables that may need updating.
    UPDATE AppUser
    SET email       = COALESCE(_email, email),
        lastName    = COALESCE(_lastName, lastName),
        firstName   = COALESCE(_firstName, firstName),
        isDonor     = COALESCE(_isDonor, isDonor),
        isReceiver  = COALESCE(_isReceiver, isReceiver)
    WHERE appUserKey = _appUserKey;

    -- Update any ContactInfo fields related to AppUser being updated.
    UPDATE ContactInfo
    SET address             = COALESCE(_address, address),
        addressLatitude     = COALESCE(_addressLatitude, addressLatitude),
        addressLongitude    = COALESCE(_addressLongitude, addressLongitude),
        city                = COALESCE(_city, city),
        state               = COALESCE(_state, state),
        zip                 = COALESCE(_zip, zip),
        phone               = COALESCE(_phone, phone)
    WHERE appUserKey = _appUserKey;

    -- Update any Organization fields related to AppUser being updated.
    IF (_organizationName IS NOT NULL)
    THEN
        UPDATE Organization
        SET name = _organizationName
        WHERE appUserKey = _appUserKey;
    END IF;

    -- Update password related to AppUser being updated. We keep track of all old passwords, so this is an insert!
    IF (_password IS NOT NULL)
    THEN
        INSERT INTO AppUserPassword (appUserKey, password)
        VALUES (_appUserKey, _password);
    END IF;
    
END;
$$ LANGUAGE plpgsql;

--SELECT updateAppUser(4, NULL, NULL, 'Nemmer');
--SELECT * FROM appUser;
