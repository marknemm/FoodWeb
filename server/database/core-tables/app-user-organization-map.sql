
--DROP TABLE AppUserOrganizationMap CASCADE;
CREATE TABLE IF NOT EXISTS AppUserOrganizationMap
(
    appUserOrganizationMapKey SERIAL PRIMARY KEY
);

ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS appUserKey          INTEGER     REFERENCES AppUser(appUserKey);
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS organizationKey     INTEGER     REFERENCES Organization(organizationKey);
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS registrationPending BOOLEAN;
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS administrator       BOOLEAN;

CREATE INDEX IF NOT EXISTS appUserOrganizationMapAppUserKeyIdx ON AppUserOrganizationMap (appUserKey);
CREATE INDEX IF NOT EXISTS appUserOrganizationMapAppUserKeyIdx ON AppUserOrganizationMap (organizationKey);
