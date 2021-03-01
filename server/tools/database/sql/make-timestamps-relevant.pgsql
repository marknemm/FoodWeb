UPDATE  "Donation"
SET     "createTimestamp"   = "createTimestamp"   + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "updateTimestamp"   = "updateTimestamp"   + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "pickupWindowStart" = "pickupWindowStart" + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "pickupWindowEnd"   = "pickupWindowEnd"   + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"));

UPDATE  "DonationClaim"
SET     "createTimestamp"     = "createTimestamp"     + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "dropOffWindowStart"  = "dropOffWindowStart"  + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "dropOffWindowEnd"    = "dropOffWindowEnd"    + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"));

UPDATE  "Delivery"
SET     "createTimestamp"     = "createTimestamp"     + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "pickupWindowStart"   = "pickupWindowStart"   + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "pickupWindowEnd"     = "pickupWindowEnd"     + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "dropOffWindowStart"  = "dropOffWindowStart"  + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "dropOffWindowEnd"    = "dropOffWindowEnd"    + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "startTime"           = CASE WHEN "startTime"   IS NOT NULL THEN ("startTime"   + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"))) ELSE NULL END,
        "pickupTime"          = CASE WHEN "pickupTime"  IS NOT NULL THEN ("pickupTime"  + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"))) ELSE NULL END,
        "dropOffTime"         = CASE WHEN "dropOffTime" IS NOT NULL THEN ("dropOffTime" + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"))) ELSE NULL END;

UPDATE  "DonationHub"
SET     "dropOffWindowStart"  = "dropOffWindowStart"  + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "dropOffWindowEnd"    = "dropOffWindowEnd"    + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"));

UPDATE  "FeaturedEvent"
SET     "date"      = "date"      + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata")),
        "showUntil" = "showUntil" + (NOW() - (SELECT "DevDbMetadata"."createTimestamp" FROM "DevDbMetadata"));

UPDATE  "DevDbMetadata"
SET     "createTimestamp" = NOW();
