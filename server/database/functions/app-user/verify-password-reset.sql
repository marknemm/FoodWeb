SELECT dropFunction('verifyPasswordResetToken');

CREATE OR REPLACE FUNCTION verifyPasswordResetToken
(
    _appUserKey             AppUserPasswordRecovery.appUserKey%TYPE,
    _passwordRecoveryToken  AppUserPasswordRecovery.passwordRecoveryToken%TYPE
)
RETURNS VOID
AS $$
BEGIN

    -- First check to see if the passwordRecoveryToken token matches.
    IF NOT EXISTS(
        SELECT 1
        FROM AppUserPasswordRecovery
        WHERE appUserKey = _appUserKey
          AND passwordRecoveryToken = _passwordRecoveryToken
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