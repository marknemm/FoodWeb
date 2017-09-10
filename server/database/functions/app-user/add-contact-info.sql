SELECT dropFunction('addContactInfo');

CREATE OR REPLACE FUNCTION addContactInfo
(
    _appUserKey         INTEGER,
    _address            VARCHAR(128),
    _addressLatitude    NUMERIC(7, 4),
    _addressLongitude   NUMERIC(7, 4),
    _city               VARCHAR(60),
    _state              CHAR(2),
    _zip                INTEGER,
    _phone              CHAR(12)
)
RETURNS INTEGER -- Will return the contactInfoKey
AS $$
    DECLARE _contactInfoKey     INTEGER; 
BEGIN

    INSERT INTO ContactInfo (appUserKey, address, addressLatitude, addressLongitude, city, state, zip, phone)
    VALUES (_appUserKey, _address, _addressLatitude, _addressLongitude, _city, _state, _zip, _phone)
    RETURNING ContactInfo.contactInfoKey INTO _contactInfoKey;

    RETURN _contactInfoKey;

END;
$$ LANGUAGE plpgsql;
