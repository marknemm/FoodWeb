--This will be called by the 'getAppUserInfo' ts function,
--and it will collect and return all the necessary DATA
SELECT dropFunction('getAppUserInfo');

CREATE OR REPLACE FUNCTION getAppUserInfo
(
    _appUserKey         INTEGER         DEFAULT NULL,
    _email              VARCHAR(128)    DEFAULT NULL,
    _lastName           VARCHAR(60)     DEFAULT NULL,
    _firstName          VARCHAR(60)     DEFAULT NULL,
    _organizationName   VARCHAR(128)    DEFAULT NULL
)
RETURNS TABLE
(
    appUserKey          INTEGER,
    email               VARCHAR(128),
    password            CHAR(60),
    lastName            VARCHAR(60),
    firstName           VARCHAR(60),
    organizationName    VARCHAR(128),
    address             VARCHAR(128),
    city                VARCHAR(60),
    state               CHAR(2),
    zip                 INTEGER,
    phone               CHAR(12),
    isDonor             BOOLEAN,
    isReceiver          BOOLEAN
)
AS $$
BEGIN

    RETURN QUERY
    SELECT  AppUser.appUserKey, 
            AppUser.email,
            AppUserPassword.password,
            AppUser.lastName,
            AppUser.firstName,
            Organization.name,
            ContactInfo.address,
            ContactInfo.city,
            ContactInfo.state,
            ContactInfo.zip,
            ContactInfo.phone,
            AppUser.isDonor,
            AppUser.isReceiver
    FROM AppUser
    INNER JOIN AppUserPassword  ON AppUser.appUserPasswordKey = AppUserPassword.appUserPasswordKey
    INNER JOIN ContactInfo      ON AppUser.contactInfoKey = ContactInfo.contactInfoKey
    LEFT JOIN  Organization     ON AppUser.organizationKey = Organization.organizationKey
    WHERE (_appUserKey IS NULL OR AppUser.appUserKey = _appUserKey)
      AND (_email IS NULL OR AppUser.email = _email)
      AND (_lastName IS NULL OR AppUser.lastName = _lastName)
      AND (_firstName IS NULL OR AppUser.firstName = _firstName)
      AND (_organizationName IS NULL OR Organization.name = _organizationName);

END;
$$ LANGUAGE plpgsql;

/*
SELECT * FROM AppUser;
SELECT * FROM getAppUserInfo(NULL, 'marknemms@gmail.com');
*/
