import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class donationWindowTimes1558199226376 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donation' AND column_name = 'pickupWindowStart')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Donation" ADD "pickupWindowStart" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD "pickupWindowEnd" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`
      UPDATE "Donation"
      SET "pickupWindowStart" = NOW(),
          "pickupWindowEnd" = NOW() + interval '1 hour'
    `);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "pickupWindowStart" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "pickupWindowEnd" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "pickupWindowEnd"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "pickupWindowStart"`);
  }

}
