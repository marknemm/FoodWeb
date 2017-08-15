
--DROP TABLE AppUserOrganizationMap CASCADE;
CREATE TABLE IF NOT EXISTS AppUserOrganizationMap
(
    appUserOrganizationMapKey SERIAL PRIMARY KEY
);

ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS appUserKey              INTEGER     NOT NULL REFERENCES AppUser(appUserKey);
-- Organization Key can be NULL since the App User can be its own receiver entitiy!
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS organizationKey         INTEGER     REFERENCES Organization(organizationKey);
-- An administrator for the company must confirm a new registration under an organization.
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS registrationPending     BOOLEAN     DEFAULT TRUE;
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS registrationConfirmDate TIMESTAMP   DEFAULT NULL;
ALTER TABLE AppUserOrganizationMap ADD COLUMN IF NOT EXISTS administrator           BOOLEAN     DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS appUserOrganizationMapAppUserKeyIdx ON AppUserOrganizationMap (appUserKey);
CREATE INDEX IF NOT EXISTS appUserOrganizationMapAppUserKeyIdx ON AppUserOrganizationMap (organizationKey);
