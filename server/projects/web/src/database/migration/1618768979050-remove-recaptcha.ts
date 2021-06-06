import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class removeRecaptcha1618768979050 implements MigrationInterface {
  name = 'removeRecaptcha1618768979050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Audit" DROP COLUMN "recaptchaScore"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Audit" ADD "recaptchaScore" double precision`);
  }

}
