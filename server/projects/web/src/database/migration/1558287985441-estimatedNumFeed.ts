import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class estimatedNumFeed1558287985441 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Donation' AND column_name = 'estimatedNumFeed')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "Donation" ADD "estimatedNumFeed" integer`);
    await queryRunner.query(`
      UPDATE "Donation"
      SET "estimatedNumFeed" = 1
    `);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedNumFeed" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donation" DROP COLUMN "estimatedNumFeed"`);
  }

}
