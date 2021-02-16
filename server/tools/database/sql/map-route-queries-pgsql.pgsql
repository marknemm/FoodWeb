SELECT
  "MapRoute"."id",
  REPLACE(
    ST_AsText("MapRoute"."startLocation"), 'POINT', ''
  ) AS "startLocation",
  REPLACE(
    ST_AsText("MapRoute"."endLocation"), 'POINT', ''
  ) AS "endLocation",
  "MapRoute"."distanceMi",
  "MapRoute"."durationMin"
FROM "MapRoute"
ORDER BY "id" DESC
LIMIT 1000;

SELECT
  "MapRoute"."id",
  REPLACE(
    ST_AsText("MapRoute"."startLocation"), 'POINT', ''
  ) AS "startLocation",
  REPLACE(
    ST_AsText("MapRoute"."endLocation"), 'POINT', ''
  ) AS "endLocation",
  "MapRoute"."distanceMi",
  "MapRoute"."durationMin"
FROM "DonationClaim"
INNER JOIN "MapRoute" ON "DonationClaim"."routeToReceiverId" = "MapRoute"."id"
UNION SELECT
  "MapRoute"."id",
  REPLACE(
    ST_AsText("MapRoute"."startLocation"), 'POINT', ''
  ) AS "startLocation",
  REPLACE(
    ST_AsText("MapRoute"."endLocation"), 'POINT', ''
  ) AS "endLocation",
  "MapRoute"."distanceMi",
  "MapRoute"."durationMin"
FROM "Delivery"
INNER JOIN "MapRoute" ON "Delivery"."routeToDonorId" = "MapRoute"."id"
ORDER BY "id" DESC
LIMIT 1000;
