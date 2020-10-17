import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class relativeAssets1567466240130 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      UPDATE "Account"
      SET "profileImgUrl" = REPLACE("profileImgUrl", '/assets/', './assets/')
      FROM "Organization"
      WHERE "Account"."profileImgUrl" LIKE '/assets/%'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      UPDATE "Account"
      SET "profileImgUrl" = REPLACE("profileImgUrl", './assets/', '/assets/')
      FROM "Organization"
      WHERE "Account"."profileImgUrl" LIKE './assets/%'
    `);
  }
}
