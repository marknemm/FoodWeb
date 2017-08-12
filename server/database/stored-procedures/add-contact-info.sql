SELECT dropFunction('addContactInfo');

CREATE OR REPLACE FUNCTION addContactInfo
(
    _address    VARCHAR(128),
    _city       VARCHAR(60),
    _state      CHAR(2),
    _zip        INTEGER,
    _phone      CHAR(12)
)
RETURNS INTEGER -- Will return the contactInfoKey
AS $$
    DECLARE contactInfoKey     INTEGER; 
BEGIN
    INSERT INTO ContactInfo (address, city, state, zip, phone)
    VALUES (_address, _city, _state, _zip, _phone)
    RETURNING ContactInfo.contactInfoKey INTO contactInfoKey;

    RETURN contactInfoKey;
END;
$$ LANGUAGE plpgsql;

--SELECT addContactInfo ('666 Hell St', 'Buffalo', 'NY', 2, '12324121');
SELECT * FROM ContactInfo;
