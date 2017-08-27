SELECT dropFunction('getMissingAddressInfo');

/**
 * Gets missing address info for a given AppUser. Any of the address fields not provided will be retrieved.
 */
CREATE OR REPLACE FUNCTION getMissingAddressInfo
(
    _appUserKey     INTEGER,
    _address        VARCHAR(128)    DEFAULT NULL,
    _city           VARCHAR(60)     DEFAULT NULL,
    _state          CHAR(2)         DEFAULT NULL,
    _zip            INTEGER         DEFAULT NULL
)
RETURNS TABLE
(
    address    VARCHAR(128),
    city       VARCHAR(60),
    state      CHAR(2),
    zip        INTEGER
)
AS $$
BEGIN

    RETURN QUERY
    SELECT  COALESCE(_address, ContactInfo.address),
            COALESCE(_city, ContactInfo.city),
            COALESCE(_state, ContactInfo.state),
            COALESCE(_zip, ContactInfo.zip)
    FROM AppUser
    INNER JOIN ContactInfo ON AppUser.contactInfoKey = ContactInfo.contactInfoKey
    WHERE AppUser.appUserKey = _appUserKey;

END;
$$ LANGUAGE plpgsql;

-- SELECT * FROM getMissingAddressInfo(4, 'blah');
