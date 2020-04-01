SELECT
  "UnverifiedAccount"."accountId",
  "UnverifiedAccount"."verificationToken",
  "Account"."accountType",
  "Account"."username",
  "ContactInfo"."email"
FROM "UnverifiedAccount"
  INNER JOIN "Account" ON "UnverifiedAccount"."accountId" = "Account"."id"
  INNER JOIN "ContactInfo" ON "Account"."contactInfoId" = "ContactInfo"."id"
ORDER BY "UnverifiedAccount"."accountId" DESC
