-- Basic function for removing users from the unverifiedAppUser table.

SELECT dropFunction('removeUnverifiedAppUser');

CREATE OR REPLACE FUNCTION removeUnverifiedAppUser
(
_token   CHAR(20)
)
RETURNS void AS $$

BEGIN

DELETE FROM UnverifiedAppUser WHERE token = _token;

END;

$$ LANGUAGE plpgsql;