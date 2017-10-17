-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addPasswordRecoveryToken');

CREATE OR REPLACE FUNCTION addPasswordRecoveryToken
(
    IN _userEmail AppUser.email%TYPE,
    OUT _recoveryToken AppUserPasswordRecovery.passwordRecoveryToken%TYPE,
    OUT _appUserKey AppUserPasswordRecovery.appUserKey%TYPE
)
-- RETURNS AppUserPasswordRecovery.passwordRecoveryToken%TYPE -- The password recovery token.
AS $$
    -- DECLARE _recoveryToken AppUserPasswordRecovery.passwordRecoveryToken%TYPE;
    -- DECLARE _appUserKey AppUserPasswordRecovery.appUserKey%TYPE;
BEGIN

    SELECT AppUser.appUserKey INTO _appUserKey FROM AppUser WHERE email = _userEmail;

    SELECT generateToken() INTO _recoveryToken;

    INSERT INTO AppUserPasswordRecovery(appUserKey, passwordRecoveryToken)
    VALUES (_appUserkey, _recoveryToken);

    -- RETURN _recoveryToken;

END;
$$ LANGUAGE plpgsql;
