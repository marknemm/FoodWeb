
SELECT dropFunction('insertIntoDonor');

CREATE OR REPLACE FUNCTION insertIntoDonor
(
    _orgName    VARCHAR(128),
    _address    VARCHAR(128),
    _city       VARCHAR(60),
    _state      CHAR(2),
    _zip        INTEGER,
    _phone      CHAR(12)
)
RETURNS INTEGER -- Returns the new Donor's donorOrganizationKey
AS $$
    DECLARE _orgKey       INTEGER     DEFAULT NULL;
BEGIN
    INSERT INTO DonorOrganization (name, address, city, state, zip, phone)
    VALUES (_orgName, _address, _city, _state, _zip, _phone)
    RETURNING donorOrganizationKey INTO _orgKey;

    RETURN _orgKey;

END;
$$ LANGUAGE plpgsql;
