
SELECT dropFunction('insertIntoAppUser');

CREATE OR REPLACE FUNCTION insertIntoAppUser
(
    _username       VARCHAR(128),
    _email          VARCHAR(128), 
    _password       CHAR(60),
    _lastName       VARCHAR(60),
    _firstName      VARCHAR(60),
    _isReceiverOrg  BOOLEAN         DEFAULT NULL,
    _isDonorOrg     BOOLEAN         DEFAULT NULL,
    _orgName        VARCHAR(128)    DEFAULT NULL,
    _address        VARCHAR(128)    DEFAULT NULL,
    _city           VARCHAR(60)     DEFAULT NULL,
    _state          CHAR(2)         DEFAULT NULL,
    _zip            INTEGER         DEFAULT NULL,
    _phone          CHAR(12)        DEFAULT NULL
)
RETURNS INTEGER -- Returns the new AppUser's appUserKey
AS $$
    DECLARE _appUserKey                 INTEGER;
    DECLARE _donorOrganizationKey       INTEGER     DEFAULT NULL;
    DECLARE _receiverOrganizationKey    INTEGER     DEFAULT NULL;
BEGIN
    -- Process Donor/Receiver Information First, and Generate Corresponding Primary Keys.
    CASE
        WHEN (_isDonorOrg = TRUE) 
            THEN 
                SELECT insertIntoDonorOrganization(_orgName, _address, _city, _state, _zip, _phone) INTO _donorOrganizationKey;
        WHEN (_isReceiverOrg = TRUE)
            THEN
                SELECT insertIntoReceiverOrganization(_orgName, _address, _city, _state, _zip, _phone) INTO _receiverOrganizationKey;
    END CASE;

    INSERT INTO AppUser (username, email, password, lastName, firstName, 
                        phone, address, city, zip, state, donorOrganizationKey, receiverOrganizationKey)
    VALUES (_username, _email, _password, _lastName, _firstName,
                        _phone, _address, _city, _zip, _state, _donorOrganizationKey, _receiverOrganizationKey)
    RETURNING appUserKey INTO _appUserKey;

    RETURN _appUserKey;

END;
$$ LANGUAGE plpgsql;
