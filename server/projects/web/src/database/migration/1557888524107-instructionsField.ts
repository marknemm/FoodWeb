import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class instructionsField1557888524194 implements MigrationInterface {
  name = 'instructionsField1557888524194';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "deliveryInstructions" text NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "deliveryInstructions"`);
  }

}
