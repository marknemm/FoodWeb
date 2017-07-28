
SELECT dropFunction('addOrganization');

CREATE OR REPLACE FUNCTION addOrganization
(
    _orgName    VARCHAR(128),
    _address    VARCHAR(128),
    _city       VARCHAR(60),
    _state      CHAR(2),
    _zip        INTEGER,
    _phone      CHAR(12),
    _isDonor    BOOLEAN,
    _isReceiver BOOLEAN
)
RETURNS INTEGER -- Returns the new Donor's donorOrganizationKey
AS $$
    DECLARE _orgInfoKey   INTEGER     DEFAULT NULL;
    DECLARE _orgKey       INTEGER     DEFAULT NULL;
BEGIN
    INSERT INTO OrganizationInfo (name, address, city, state, zip, phone)
    VALUES (_orgName, _address, _city, _state, _zip, _phone)
    RETURNING organizationInfoKey INTO _orgInfoKey;

    IF (_isDonor = TRUE) THEN
        INSERT INTO DonorOrganization (organizationInfoKey)
        VALUES (_orgInfoKey)
        RETURNING donorOrganizationKey INTO _orgKey;
    END IF;
    IF (_isReceiver = TRUE) THEN
        INSERT INTO ReceiverOrganization (organizationInfoKey)
        VALUES (_orgInfoKey)
        RETURNING receiverOrganizationKey INTO _orgKey;
    END IF;
    IF (_isDonor = FALSE AND _isReceiver = FALSE) THEN
        RAISE NOTICE 'Error: _isDonor and _isReceiver both not specified as TRUE';
    END IF;

    RETURN _orgKey;

END;
$$ LANGUAGE plpgsql;
