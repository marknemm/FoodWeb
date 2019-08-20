import { MigrationInterface, QueryRunner } from 'typeorm';

export class eventRegistration1566268190081 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "EventRegistration" ("id" SERIAL NOT NULL, "eventTitleDate" character varying NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "accountId" integer, CONSTRAINT "PK_5b09ac0d2d829dfaf7a13f66721" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_adc757ce53870cb8d536fab1c0" ON "EventRegistration" ("eventTitleDate") `);
    await queryRunner.query(`ALTER TABLE "EventRegistration" ADD CONSTRAINT "FK_23a58dc54b801f5abf6d191f1c9" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "EventRegistration" DROP CONSTRAINT "FK_23a58dc54b801f5abf6d191f1c9"`);
    await queryRunner.query(`DROP INDEX "IDX_adc757ce53870cb8d536fab1c0"`);
    await queryRunner.query(`DROP TABLE "EventRegistration"`);
  }

}
