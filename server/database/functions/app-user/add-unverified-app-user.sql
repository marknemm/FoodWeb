-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addUnverifiedAppUser');

CREATE OR REPLACE FUNCTION addUnverifiedAppUser
(
    _appUserKey UnverifiedAppUser.appUserKey%TYPE
)
RETURNS UnverifiedAppUser.verificationToken%TYPE -- The verification token.
AS $$
    DECLARE _verificationToken UnverifiedAppUser.verificationToken%TYPE = '';
BEGIN

    -- First, generate a 20 character verification token consisting of upper case letters (for sake of simplicity).
    FOR counter IN 1..20 LOOP
        _verificationToken := _verificationToken || chr(ascii('A') + (random() * 26)::integer);
    END LOOP;

    INSERT INTO UnverifiedAppUser(appUserKey, verificationToken)
    VALUES (_appUserkey, _verificationToken);

    RETURN _verificationToken;

END;
$$ LANGUAGE plpgsql;
