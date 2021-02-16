SELECT
  "ContactInfo"."email",
  "ContactInfo"."phoneNumber",
  "Volunteer"."firstName",
  "Volunteer"."lastName",
  "Organization"."name"
FROM "ContactInfo"
INNER JOIN "Account" ON "Account"."contactInfoId" = "ContactInfo"."id"
LEFT JOIN "Volunteer" ON "Volunteer"."accountId" = "Account"."id"
LEFT JOIN "Organization" ON "Organization"."accountId" = "Account"."id"
WHERE "email" IN ('<email>');
