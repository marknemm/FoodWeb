
SELECT dropFunction('addorganization');

CREATE OR REPLACE FUNCTION addOrganization
(
    _orgName                            VARCHAR(128),
    _isDonor                            BOOLEAN,
    _isReceiver                         BOOLEAN,
    _contactInfoKey                     INTEGER
)
RETURNS INTEGER -- Returns the new Donor's/Receiver's donorOrganizationKey
AS $$
    DECLARE _organizationKey            INTEGER     DEFAULT NULL;
BEGIN

    INSERT INTO Organization (name, contactInfoKey)
    VALUES (_orgName, _contactInfoKey)
    RETURNING Organization.organizationKey INTO _organizationKey;

    IF (_isDonor = TRUE) THEN
        INSERT INTO DonorOrganization (organizationKey)
        VALUES (_organizationKey);
    END IF;
    IF (_isReceiver = TRUE) THEN
        INSERT INTO ReceiverOrganization (organizationKey)
        VALUES (_organizationKey);
    END IF;
    IF (_isDonor = FALSE AND _isReceiver = FALSE) THEN
        RAISE NOTICE 'Error: _isDonor and _isReceiver both not specified as TRUE';
    END IF;

    RETURN _organizationKey;

END;
$$ LANGUAGE plpgsql;

--SELECT addOrganization('testOrganization', true, false, 1);
