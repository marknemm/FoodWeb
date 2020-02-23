import { MigrationInterface, QueryRunner } from 'typeorm';

export class donationCompleteTrigger1580768664939 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donation' AND column_name = 'complete')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`ALTER TABLE "Donation" ADD COLUMN "complete" BOOLEAN DEFAULT FALSE`);
    await queryRunner.query(`UPDATE "Donation" SET "complete" = ("donationStatus" = 'Complete')`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "updateDonationComplete"()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."complete" := (NEW."donationStatus" = 'Complete');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "updateDonationCompleteTrigger"
      AFTER UPDATE OF "donationStatus" ON "Donation"
      FOR EACH ROW EXECUTE PROCEDURE "updateDonationComplete"();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TRIGGER "updateDonationCompleteTrigger"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "complete"`);
  }

}
