SELECT dropFunction ('generateToken');

CREATE OR REPLACE FUNCTION generateToken
()
RETURNS TEXT
AS $$
    DECLARE _randomToken    CHAR(20) = '';
BEGIN

    -- Generate a 20 character random token consisting of upper case letters (for sake of simplicity).
    FOR counter IN 1..20 LOOP
        _randomToken := _randomToken || chr(ascii('A') + (random() * 26)::integer);
    END LOOP;

    RETURN _randomToken;

END;
$$ LANGUAGE plpgsql;