-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addPasswordRecoveryToken');

CREATE OR REPLACE FUNCTION addPasswordRecoveryToken
(
    _appUserKey AppUserPasswordRecovery.appUserKey%TYPE
)
RETURNS AppUserPasswordRecovery.passwordRecoveryToken%TYPE -- The password recovery token.
AS $$
    DECLARE _recoveryToken AppUserPasswordRecovery.passwordRecoveryToken%TYPE;
BEGIN

    SELECT generateToken() INTO _recoveryToken;

    INSERT INTO AppUserPasswordRecovery(appUserKey, passwordRecoveryToken)
    VALUES (_appUserkey, _recoveryToken);

    RETURN _recoveryToken;

END;
$$ LANGUAGE plpgsql;
