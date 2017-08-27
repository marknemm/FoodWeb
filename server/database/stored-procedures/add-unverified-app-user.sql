-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addUnverifiedAppUser');

CREATE OR REPLACE FUNCTION addUnverifiedAppUser
(
_appUserKey  INTEGER,
_token   CHAR(20)
)
RETURNS void AS $$

BEGIN

INSERT INTO UnverifiedAppUser(appUserKey, token)
VALUES (_appUserkey, _token);

END;

$$ LANGUAGE plpgsql;