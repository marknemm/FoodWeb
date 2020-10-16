import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class moveDeliveryUnderClaim1578808014097 implements MigrationInterface {
  name = 'moveDeliveryUnderClaim1578808014097';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Delivery' AND column_name = 'claimId')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_938d39366adb780438836faec34"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" RENAME COLUMN "donationId" TO "claimId"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "REL_938d39366adb780438836faec3"`, undefined);

    await queryRunner.query(`
      UPDATE "Delivery"
      SET "claimId" = (
        SELECT "DonationClaim"."id"
        FROM "DonationClaim"
        INNER JOIN "Donation" ON "DonationClaim"."donationId" = "Donation"."id"
        INNER JOIN "Delivery" AS "DeliverySub" ON "Delivery"."claimId" = "Donation"."id"
        WHERE "Delivery"."id" = "DeliverySub"."id"
      )
    `);

    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "REL_938d39366adb780438836faec3" UNIQUE ("claimId")`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_a757ba8ea0ee10378e424e3ca02" FOREIGN KEY ("claimId") REFERENCES "DonationClaim"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Delivery' AND column_name = 'donationId')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "FK_a757ba8ea0ee10378e424e3ca02"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" RENAME COLUMN "claimId" TO "donationId"`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP CONSTRAINT "REL_938d39366adb780438836faec3"`, undefined);

    await queryRunner.query(`
      UPDATE "Delivery"
      SET "donationId" = (
        SELECT "Donation"."id"
        FROM "Donation"
        INNER JOIN "DonationClaim" ON "DonationClaim"."donationId" = "Donation"."id"
        INNER JOIN "Delivery" AS "DeliverySub" ON "Delivery"."donationId" = "DonationClaim"."id"
        WHERE "Delivery"."id" = "DeliverySub"."id"
      )
    `);

    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "REL_938d39366adb780438836faec3" UNIQUE ("donationId")`, undefined);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD CONSTRAINT "FK_938d39366adb780438836faec34" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

}
