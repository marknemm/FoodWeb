
SELECT dropFunction('insertIntoReceiverOrganization');

CREATE OR REPLACE FUNCTION insertIntoReceiverOrganization
(
    _orgName    VARCHAR(128),
    _address    VARCHAR(128),
    _city       VARCHAR(60),
    _state      CHAR(2),
    _zip        INTEGER,
    _phone      CHAR(12)
)
RETURNS INTEGER -- Returns the new Receiver's receiverOrganizationKey
AS $$
    DECLARE _orgKey       INTEGER     DEFAULT NULL;
BEGIN
    INSERT INTO ReceiverOrganization (name, phone, address, city, zip, state)
    VALUES (_orgName, _phone, _address, _city, _zip, _state)
    RETURNING receiverOrganizationKey INTO _orgKey;

    RETURN _orgKey;

END;
$$ LANGUAGE plpgsql;
