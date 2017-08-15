--This will be called by the 'getAppUserInfo' ts function,
--and it will collect and return all the necessary DATA
SELECT dropFunction('getAppUserPrimaryInfo');
CREATE OR REPLACE FUNCTION getAppUserPrimaryInfo
(
    usernameOrEmail         VARCHAR(128)        DEFAULT NULL   
)
RETURNS TABLE
(
    appUserKey              INTEGER,
    username                VARCHAR(128),
    email                   VARCHAR(128),
    password                CHAR(60),
    organizationKey         INTEGER
)

AS $$

BEGIN

    -- Note: this will potentially return multiple rows due to the 1 - many relationship between a given AppUser and related Organization(s).
    RETURN QUERY
    SELECT  AppUser.appUserKey, 
            AppUser.userName,
            AppUser.email,
            AppUserPassword.password,
            AppUserOrganizationMap.organizationKey
    FROM AppUser
    INNER JOIN AppUserPassword              ON AppUser.appUserPasswordKey = AppUserPassword.appUserPasswordKey
    INNER JOIN AppUserOrganizationMap       ON AppUserOrganizationMap.appUserKey = AppUser.appUserKey
    WHERE (AppUser.username = usernameOrEmail OR AppUser.email = usernameOrEmail);

END;
$$ LANGUAGE plpgsql;

SELECT * FROM AppUser;
SELECT * FROM AppUserOrganizationMap;
SELECT * FROM getAppUserPrimaryInfo('whoGivesAFauq55');