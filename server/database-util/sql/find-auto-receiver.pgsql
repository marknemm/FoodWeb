SELECT
  DISTINCT "distinctAlias"."account_id" as "ids_account_id",
  "distinctAlias".auto_claim_count,
  "distinctAlias".random
FROM
  (
    SELECT
      "account"."id" AS "account_id",
      "account"."accountType" AS "account_accountType",
      "account"."username" AS "account_username",
      "account"."profileImg" AS "account_profileImg",
      "account"."lastSeenNotificationId" AS "account_lastSeenNotificationId",
      "account"."updateTimestamp" AS "account_updateTimestamp",
      "account"."createTimestamp" AS "account_createTimestamp",
      "account"."contactInfoId" AS "account_contactInfoId",
      "contactInfo"."id" AS "contactInfo_id",
      "contactInfo"."email" AS "contactInfo_email",
      "contactInfo"."phoneNumber" AS "contactInfo_phoneNumber",
      "contactInfo"."streetAddress" AS "contactInfo_streetAddress",
      "contactInfo"."city" AS "contactInfo_city",
      "contactInfo"."stateProvince" AS "contactInfo_stateProvince",
      "contactInfo"."postalCode" AS "contactInfo_postalCode",
      ST_AsGeoJSON("contactInfo"."location") :: json AS "contactInfo_location",
      "contactInfo"."timezone" AS "contactInfo_timezone",
      "contactInfo"."enableEmail" AS "contactInfo_enableEmail",
      "contactInfo"."enablePushNotification" AS "contactInfo_enablePushNotification",
      "contactInfo"."notifyForEachDonation" AS "contactInfo_notifyForEachDonation",
      "organization"."id" AS "organization_id",
      "organization"."name" AS "organization_name",
      "organization"."description" AS "organization_description",
      "organization"."deliveryInstructions" AS "organization_deliveryInstructions",
      "organization"."accountId" AS "organization_accountId",
      "receiver"."id" AS "receiver_id",
      "receiver"."autoReceiver" AS "receiver_autoReceiver",
      "receiver"."organizationId" AS "receiver_organizationId",
      "donor"."id" AS "donor_id",
      "donor"."organizationId" AS "donor_organizationId",
      "volunteer"."id" AS "volunteer_id",
      "volunteer"."lastName" AS "volunteer_lastName",
      "volunteer"."firstName" AS "volunteer_firstName",
      "volunteer"."signedAgreement" AS "volunteer_signedAgreement",
      "volunteer"."accountId" AS "volunteer_accountId",
      "operationHours"."id" AS "operationHours_id",
      "operationHours"."weekday" AS "operationHours_weekday",
      "operationHours"."startTime" AS "operationHours_startTime",
      "operationHours"."endTime" AS "operationHours_endTime",
      "operationHours"."accountId" AS "operationHours_accountId",
      (
        SELECT
          COUNT("autoClaimHistory"."id") AS "auto_claim_count"
        FROM
          "AutoClaimHistory" "autoClaimHistory"
          INNER JOIN "DonationClaim" "claim" ON "autoClaimHistory"."claimId" = "claim"."id"
        WHERE
          "claim"."receiverAccountId" = "account"."id"
          AND "autoClaimHistory"."timestamp" >= (NOW() - INTERVAL '48 HOURS')
      ) AS "auto_claim_count",
      RANDOM AS "random"
    FROM "Account" "account"
      INNER JOIN "ContactInfo" "contactInfo" ON "contactInfo"."id"="account"."contactInfoId"
      LEFT JOIN "Organization" "organization" ON "organization"."accountId"="account"."id"
      LEFT JOIN "Receiver" "receiver" ON "receiver"."organizationId"="organization"."id"
      LEFT JOIN "Donor" "donor" ON "donor"."organizationId"="organization"."id"
      LEFT JOIN "Volunteer" "volunteer" ON "volunteer"."accountId"="account"."id"
      LEFT JOIN "OperationHours" "operationHours" ON "operationHours"."accountId"="account"."id"
    WHERE "account"."accountType" = 'Receiver'
      AND "receiver"."autoReceiver" = true
      AND
        (
          "operationHours"."weekday" IS NULL
          OR (
            "operationHours"."weekday" = 'Saturday'
            AND NOT (
              "operationHours"."startTime" >= '11:45 PM'
              OR "operationHours"."endTime" <= '3:10 PM'
            )
          )
        )
      AND ST_DWithin(ST_MakePoint(-78.7138516, 42.8827589), "contactInfo"."location", 32186.8)
  ) "distinctAlias"
ORDER BY
  "distinctAlias".auto_claim_count ASC,
  "distinctAlias".random ASC,
  "account_id" ASC
LIMIT 1
