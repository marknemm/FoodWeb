import { MigrationInterface, QueryRunner } from 'typeorm';

export class appSessionToken1570988693732 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "AppSession" ("id" SERIAL NOT NULL, "appSessionToken" character varying NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer NOT NULL, CONSTRAINT "REL_a5bf92aa3c976715684a272226" UNIQUE ("accountId"), CONSTRAINT "PK_06e3d692ecd443d27ceea01a755" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "AppSession" ADD CONSTRAINT "FK_a5bf92aa3c976715684a2722262" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "AppSession" DROP CONSTRAINT "FK_a5bf92aa3c976715684a2722262"`);
    await queryRunner.query(`DROP TABLE "AppSession"`);
  }
}
