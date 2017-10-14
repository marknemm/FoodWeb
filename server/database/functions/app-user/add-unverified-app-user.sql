-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addUnverifiedAppUser');

CREATE OR REPLACE FUNCTION addUnverifiedAppUser
(
    _appUserKey UnverifiedAppUser.appUserKey%TYPE
)
RETURNS UnverifiedAppUser.verificationToken%TYPE -- The verification token.
AS $$
    DECLARE _verificationToken UnverifiedAppUser.verificationToken%TYPE;
BEGIN

    SELECT generateToken() INTO _verificationToken;

    INSERT INTO UnverifiedAppUser(appUserKey, verificationToken)
    VALUES (_appUserkey, _verificationToken);

    RETURN _verificationToken;

END;
$$ LANGUAGE plpgsql;
