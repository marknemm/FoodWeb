import { MigrationInterface, QueryRunner } from 'typeorm';
import { getDrivingDistTime, DistanceTimeQueryResult } from '../helpers/distance-time';

export class donationClaim1575237456579 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Account" DROP CONSTRAINT "FK_f3f5c02509d4f9b16cdebfd9bff"`);
    await queryRunner.query(`CREATE TABLE "DonationClaim" ("id" SERIAL NOT NULL, "distanceMiToReceiver" real NOT NULL, "durationMinToReceiver" integer NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "donationId" integer, "receiverAccountId" integer, CONSTRAINT "REL_8550ec0b53280fe4700cabe463" UNIQUE ("donationId"), CONSTRAINT "PK_2813be32fd05c470af28ec3d702" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD CONSTRAINT "FK_8550ec0b53280fe4700cabe4636" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" ADD CONSTRAINT "FK_81aebb3cb5cedb4728249963b9e" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    const results: any[] = await queryRunner.query(`
      SELECT      "donation"."id"                                   AS "donationId",
                  "receiverAccount"."id"                            AS "receiverAccountId",
                  ST_Y("donorContactInfo"."location"::geometry)     AS "donorLat",
                  ST_X("donorContactInfo"."location"::geometry)     AS "donorLon",
                  ST_Y("receiverContactInfo"."location"::geometry)  AS "receiverLat",
                  ST_X("receiverContactInfo"."location"::geometry)  AS "receiverLon"
      FROM        "Donation"    AS "donation"
      INNER JOIN  "ContactInfo" AS "donorContactInfo"    ON "donorContactInfo"."id" = "donation"."donorContactOverrideId"
      INNER JOIN  "Account"     AS "receiverAccount"     ON "receiverAccount"."id" = "donation"."receiverAccountId"
      INNER JOIN  "ContactInfo" AS "receiverContactInfo" ON "receiverContactInfo"."id" = "receiverAccount"."contactInfoId"
    `);
    for (const result of results) {
      const origin: string = `${result.donorLat},${result.donorLon}`;
      const destination: string = `${result.receiverLat},${result.receiverLon}`;
      const drivingDistTime: DistanceTimeQueryResult[] = await getDrivingDistTime([{ origin, destination }]);
      await queryRunner.query(`
        INSERT INTO "DonationClaim" ("donationId", "receiverAccountId", "distanceMiToReceiver", "durationMinToReceiver")
        VALUES ($1, $2, $3, $4)
      `, [result.donationId, result.receiverAccountId, drivingDistTime[0].distanceMi, drivingDistTime[0].durationMin]);
    }
    await queryRunner.query(`ALTER TABLE "Donation" DROP CONSTRAINT "FK_fba6bda168431a242bd8f0e42f0"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "receiverAccountId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP CONSTRAINT "FK_81aebb3cb5cedb4728249963b9e"`);
    await queryRunner.query(`ALTER TABLE "DonationClaim" DROP CONSTRAINT "FK_8550ec0b53280fe4700cabe4636"`);
    await queryRunner.query(`DROP INDEX "IDX_7a31b3a0e80a0784368db77a99"`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD "receiverAccountId" integer`);
    await queryRunner.query(`
      UPDATE  "Donation"
      SET     "Donation"."receiverAccount" = (
                SELECT "receiverAccount"
                FROM   "DonationClaim"
                WHERE  "DonationClaim"."donation" = "Donation"."id"
              )
      WHERE   "Donation"."claim" IS NOT NULL;
    `);
    await queryRunner.query(`DROP TABLE "DonationClaim"`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD CONSTRAINT "FK_fba6bda168431a242bd8f0e42f0" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

}
