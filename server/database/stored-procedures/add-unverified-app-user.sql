-- Basic function for adding unverified users to the unverifiedAppUser table.

SELECT dropFunction('addUnverifiedAppUser');

CREATE OR REPLACE FUNCTION addUnverifiedAppUser
(
_appUserKey  INTEGER,
_stringToken   CHAR(20)
)
RETURNS void AS $$

BEGIN

INSERT INTO UnverifiedAppUser(appUserKey, stringToken)
VALUES (_appUserkey, _stringToken);

END;

$$ LANGUAGE plpgsql;