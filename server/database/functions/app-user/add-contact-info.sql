SELECT dropFunction('addContactInfo');

CREATE OR REPLACE FUNCTION addContactInfo
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
    DECLARE _gpsCoordinate      ContactInfo.gpsCoordinate%TYPE;
    DECLARE _contactInfoKey     ContactInfo.contactInfoKey%TYPE; 
BEGIN

    _gpsCoordinate := createGPSCoordinate(_latitude, _longitude);

    INSERT INTO ContactInfo (appUserKey, address, gpsCoordinate, city, state, zip, phone)
    VALUES      (_appUserKey, _address, _gpsCoordinate, _city, _state, _zip, _phone)
    RETURNING   ContactInfo.contactInfoKey
    INTO        _contactInfoKey;

    RETURN _contactInfoKey;

END;
$$ LANGUAGE plpgsql;
