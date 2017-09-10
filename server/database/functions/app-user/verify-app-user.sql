SELECT dropFunction('verifyAppUser');

CREATE OR REPLACE FUNCTION verifyAppUser
(
    _appUserKey         INTEGER,
    _verificationToken  CHAR(20)
)
RETURNS VOID
AS $$
BEGIN

    -- First check to see if the verification token matches.
    IF NOT EXISTS(
        SELECT 1
        FROM UnverifiedAppUser
        WHERE appUserKey = _appUserKey
          AND verificationToken = _verificationToken
        LIMIT 1
    )
    THEN
        RAISE EXCEPTION 'Verification token is incorrect';
    END IF;

    -- Finally, perform the deletion.
    DELETE FROM UnverifiedAppUser
    WHERE appUserKey = _appUserKey;

END;
$$ LANGUAGE plpgsql;