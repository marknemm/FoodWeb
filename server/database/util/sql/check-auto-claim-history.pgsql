SELECT
  "AutoClaimHistory"."timestamp",
  "Account"."id"
FROM "AutoClaimHistory"
  INNER JOIN "DonationClaim"  ON "AutoClaimHistory"."claimId" = "DonationClaim"."id"
  INNER JOIN "Account"        ON "DonationClaim"."receiverAccountId" = "Account"."id"
