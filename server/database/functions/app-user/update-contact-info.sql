SELECT dropFunction('updateContactInfo');

CREATE OR REPLACE FUNCTION updateContactInfo
(
    _appUserKey ContactInfo.AppUserKey%TYPE,
    _address    ContactInfo.address%TYPE        DEFAULT NULL,
    _latitude   NUMERIC(9, 6)                   DEFAULT NULL,
    _longitude  NUMERIC(9, 6)                   DEFAULT NULL,
    _city       ContactInfo.city%TYPE           DEFAULT NULL,
    _state      ContactInfo.state%TYPE          DEFAULT NULL,
    _zip        ContactInfo.zip%TYPE            DEFAULT NULL,
    _phone      ContactInfo.phone%TYPE          DEFAULT NULL
)
RETURNS ContactInfo.contactInfoKey%TYPE -- Will return the contactInfoKey
AS $$
    DECLARE _gpsCoordinate     ContactInfo.gpsCoordinate%TYPE  DEFAULT NULL;
    DECLARE _contactInfoKey     ContactInfo.contactInfoKey%TYPE; 
BEGIN

    IF (_latitude IS NOT NULL)
    THEN
        _gpsCoordinate := creategpsCoordinate(_latitude, _longitude);
    END IF;

    UPDATE      ContactInfo
    SET         address         = COALESCE(_address, address),
                gpsCoordinate   = COALESCE(_gpsCoordinate, gpsCoordinate),
                city            = COALESCE(_city, city),
                state           = COALESCE(_state, state),
                zip             = COALESCE(_zip, zip),
                phone           = COALESCE(_phone, phone)
    WHERE       appUserKey = _appUserKey
    RETURNING   contactInfoKey
    INTO        _contactInfoKey;

    RETURN _contactInfoKey;

END;
$$ LANGUAGE plpgsql;
