SELECT dropFunction('removePasswordRecoveryToken');

CREATE OR REPLACE FUNCTION removePasswordRecoveryToken
(
    _appUserKey         AppUserPasswordRecovery.appUserKey%TYPE,
    _recoveryToken      AppUserPasswordRecovery.passwordRecoveryToken%TYPE
)
RETURNS VOID
AS $$
BEGIN

    -- First check to see if the password recovery token token matches.
    IF NOT EXISTS(
        SELECT 1
        FROM AppUserPasswordRecovery
        WHERE appUserKey = _appUserKey
          AND passwordRecoveryToken = _recoveryToken
        LIMIT 1
    )
    THEN
        RAISE EXCEPTION 'Password recovery token is incorrect';
    END IF;

    -- Finally, perform the deletion.
    DELETE FROM AppUserPasswordRecovery
    WHERE appUserKey = _appUserKey;

END;
$$ LANGUAGE plpgsql;