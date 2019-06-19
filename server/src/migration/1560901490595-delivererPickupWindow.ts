import { MigrationInterface, QueryRunner } from 'typeorm';

export class delivererPickupWindow1560901490595 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Delivery' AND column_name = 'pickupWindowStart')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "pickupWindowStart" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "pickupWindowEnd" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`UPDATE "Delivery" SET "pickupWindowStart" = '2019-06-05 09:00:00'::timestamptz, "pickupWindowEnd" = '2019-06-05 09:15:00'::timestamptz`);
    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "pickupWindowStart" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "Delivery" ALTER COLUMN "pickupWindowEnd" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "pickupWindowEnd"`);
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "pickupWindowStart"`);
  }
}
