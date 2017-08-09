
CREATE TABLE IF NOT EXISTS AppUserOrganizationMap
(
    appUserOrganizationMapKey SERIAL PRIMARY KEY
);

ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS appUserKey          INTEGER     REFERENCES AppUser(appUserKey);
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS organizationKey     INTEGER     REFERENCES Organization(organizationKey);

CREATE INDEX IF NOT EXISTS appUserKeyInfoIdx ON AppUserOrganizationMap (appUserKey);
CREATE INDEX IF NOT EXISTS organizationKeyInfoIdx ON AppUserOrganizationMap (organizationKey);
