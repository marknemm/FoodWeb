SELECT "ContactInfo"."email" FROM "Account"
INNER JOIN "Volunteer" ON "Account"."id" = "Volunteer"."accountId"
INNER JOIN "ContactInfo" ON "Account"."contactInfoId" = "ContactInfo"."id"
WHERE "Volunteer"."hasEquipment" = false
ORDER BY "ContactInfo"."email";
