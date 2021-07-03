import { MigrationInterface, QueryRunner } from 'typeorm';

export class Volunteer1557796559798 implements MigrationInterface {
  name = 'Volunteer1557796559798';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(`SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Volunteer')`))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`CREATE TABLE "Volunteer" ("id" SERIAL NOT NULL, "lastName" character varying NOT NULL, "firstName" character varying NOT NULL, "accountId" integer, CONSTRAINT "REL_9edcd1322b945110e96f229a76" UNIQUE ("accountId"), CONSTRAINT "PK_ff269e3173a732c0dab4d97ad17" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_19463c968c86f66ba9bf515d34" ON "Volunteer" ("lastName") `);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" TYPE numeric`);
    await queryRunner.query(`ALTER TYPE "account_accounttype_enum" RENAME TO "account_accounttype_enum_old"`);
    await queryRunner.query(`CREATE TYPE "account_accounttype_enum" AS ENUM('Donor', 'Receiver', 'Volunteer', 'Admin')`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" TYPE "account_accounttype_enum" USING "accountType"::"text"::"account_accounttype_enum"`);
    await queryRunner.query(`DROP TYPE "account_accounttype_enum_old"`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" SET NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_4b78c82b20ff8789ee0e1b0b91" ON "ContactInfo" ("streetAddress") `);
    await queryRunner.query(`ALTER TABLE "Volunteer" ADD CONSTRAINT "FK_9edcd1322b945110e96f229a769" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Volunteer" DROP CONSTRAINT "FK_9edcd1322b945110e96f229a769"`);
    await queryRunner.query(`DROP INDEX "IDX_4b78c82b20ff8789ee0e1b0b91"`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" DROP NOT NULL`);
    await queryRunner.query(`CREATE TYPE "account_accounttype_enum_old" AS ENUM('Donor', 'Receiver', 'Driver', 'Admin')`);
    await queryRunner.query(`ALTER TABLE "Account" ALTER COLUMN "accountType" TYPE "account_accounttype_enum_old" USING "accountType"::"text"::"account_accounttype_enum_old"`);
    await queryRunner.query(`DROP TYPE "account_accounttype_enum"`);
    await queryRunner.query(`ALTER TYPE "account_accounttype_enum_old" RENAME TO "account_accounttype_enum"`);
    await queryRunner.query(`ALTER TABLE "Donation" ALTER COLUMN "estimatedValue" TYPE numeric`);
    await queryRunner.query(`DROP INDEX "IDX_19463c968c86f66ba9bf515d34"`);
    await queryRunner.query(`DROP TABLE "Volunteer"`);
  }

}
