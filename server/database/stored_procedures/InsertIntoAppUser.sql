
SELECT dropFunction('insertIntoAppUser');

CREATE OR REPLACE FUNCTION insertIntoAppUser
(
    _username   VARCHAR(128),
    _email      VARCHAR(128), 
    _password   CHAR(60),
    _lastName   VARCHAR(60),
    _firstName  VARCHAR(60),
    _org        BOOLEAN,
    _donorOrg   BOOLEAN,
    _orgName    VARCHAR(128),
    _address    VARCHAR(128),
    _city       VARCHAR(60),
    _state      CHAR(2),
    _zip        INTEGER,
    _phone      CHAR(12)
)
RETURNS INTEGER -- Returns the new AppUser's appUserKey
AS $$
    DECLARE _appUserKey     INTEGER;
    DECLARE _donorKey       INTEGER     DEFAULT NULL;
    DECLARE _recieverKey    INTEGER     DEFAULT NULL;
BEGIN
    SELECT _org, _donorOrg, _donorKey,
    CASE
        WHEN (_org = TRUE AND _donorOrg = TRUE) 
            THEN 
                SELECT insertIntoDonor(_orgName, _address, _city, _state, _zip, _phone);
        WHEN (_org = TRUE AND _donorOrg = FALSE)
            THEN
                SELECT _receiverKey = insertIntoReciever(_orgName, _address, _city, _state, _zip, _phone)
    END CASE
    INSERT INTO AppUser (username, email, password, lastName, firstName, 
                        phone, address, city, zip, state, donorOrganizationKey, receiverOrganizationKey)
    VALUES (_username, _email, _password, _lastName, _firstName,
                        _phone, _address, _city, _zip, _state, _donorKey, _recieverKey)
    RETURNING appUserKey INTO _appUserKey;

    RETURN _appUserKey;

END;
$$ LANGUAGE plpgsql;

