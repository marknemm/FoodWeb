/**
 * An aggregate of all the App User Information for a single App User.
 */
DO $$
BEGIN

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appuserinfoaggregate')
    THEN

        CREATE TYPE AppUserInfoAggregate AS
        (
            appUserKey          INTEGER,
            email               VARCHAR(128),
            password            CHAR(60),
            lastName            VARCHAR(60),
            firstName           VARCHAR(60),
            organizationName    VARCHAR(128),
            address             VARCHAR(128),
            city                VARCHAR(60),
            state               CHAR(2),
            zip                 INTEGER,
            latitude            NUMERIC(9, 6),
            longitude           NUMERIC(9, 6),
            phone               CHAR(12),
            isDonor             BOOLEAN,
            isReceiver          BOOLEAN,
            signupVerified      BOOLEAN,
            verificationToken   CHAR(20)
        );

    END IF;

END$$;
