import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1557632233526 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = await queryRunner.query(`SELECT EXISTS (SELECT 1 FROM pg_tables WHERE pg_tables.tablename = 'ContactInfo')`);
    if (alreadyCreated) { return; }
    await queryRunner.query(`CREATE TABLE "ContactInfo" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "streetAddress" character varying NOT NULL, "city" character varying NOT NULL, "stateProvince" character varying NOT NULL, "postalCode" character varying NOT NULL, "accountId" integer, CONSTRAINT "REL_6908e72e533a706c1d61f85dab" UNIQUE ("accountId"), CONSTRAINT "PK_6f8dde4721b91fd792e2e46588c" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_50f45bd1bc452467959eb2d86d" ON "ContactInfo" ("email") `);
    await queryRunner.query(`CREATE TABLE "Organization" ("id" SERIAL NOT NULL, "organizationName" character varying NOT NULL, "organizationInfo" text NOT NULL DEFAULT '', "accountId" integer, CONSTRAINT "REL_1163449e5a53ab64ad2536b455" UNIQUE ("accountId"), CONSTRAINT "PK_67bcafc78935cd441a054c6d4ea" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TYPE "operationhours_weekday_enum" AS ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')`);
    await queryRunner.query(`CREATE TABLE "OperationHours" ("id" SERIAL NOT NULL, "weekday" "operationhours_weekday_enum" NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "accountId" integer, CONSTRAINT "PK_2026a8275d6905441155877de0d" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TYPE "donation_donationstatus_enum" AS ENUM('Unmatched', 'Matched', 'Complete')`);
    await queryRunner.query(`CREATE TABLE "Donation" ("id" SERIAL NOT NULL, "donorLastName" character varying NOT NULL, "donorFirstName" character varying NOT NULL, "donationType" character varying NOT NULL, "description" character varying NOT NULL, "estimatedValue" numeric NOT NULL, "donationStatus" "donation_donationstatus_enum" NOT NULL DEFAULT 'Matched', "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "donorAccountId" integer, "receiverAccountId" integer, CONSTRAINT "PK_f3824607b80632a8619c8e93426" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE INDEX "IDX_770ca810f803f6d59384204d21" ON "Donation" ("donorLastName") `);
    await queryRunner.query(`CREATE TYPE "account_accounttype_enum" AS ENUM('Donor', 'Receiver', 'Admin')`);
    await queryRunner.query(`CREATE TABLE "Account" ("id" SERIAL NOT NULL, "accountType" "account_accounttype_enum", "username" character varying NOT NULL, "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bf68fd30f1adeede9c72a5cac09" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c8782447aa50983c50fa634d9c" ON "Account" ("username") `);
    await queryRunner.query(`CREATE TABLE "PasswordReset" ("id" SERIAL NOT NULL, "createTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "resetToken" character varying NOT NULL, "accountId" integer NOT NULL, CONSTRAINT "REL_1aa875e542fc0ed2be1ceb00c9" UNIQUE ("accountId"), CONSTRAINT "PK_ef0138f2aca0a0f38b49d683442" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "Password" ("id" SERIAL NOT NULL, "passwordHash" character varying NOT NULL, "updateTimestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountId" integer, CONSTRAINT "REL_84f85b5ebbfeaa129fe2e07916" UNIQUE ("accountId"), CONSTRAINT "PK_07377bffb1bb311a73ed9e2b514" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "UnverifiedAccount" ("id" SERIAL NOT NULL, "verificationToken" character varying NOT NULL, "accountId" integer, CONSTRAINT "REL_e7562406292a6e47eb17697ccb" UNIQUE ("accountId"), CONSTRAINT "PK_ee84fd35703e440d08654ce4c1a" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD CONSTRAINT "FK_6908e72e533a706c1d61f85dab7" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Organization" ADD CONSTRAINT "FK_1163449e5a53ab64ad2536b4550" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "OperationHours" ADD CONSTRAINT "FK_c6c655044bd021a89231b4b31da" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD CONSTRAINT "FK_59c1cb9a0762dcd7fd19a1a9098" FOREIGN KEY ("donorAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Donation" ADD CONSTRAINT "FK_fba6bda168431a242bd8f0e42f0" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "PasswordReset" ADD CONSTRAINT "FK_1aa875e542fc0ed2be1ceb00c94" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Password" ADD CONSTRAINT "FK_84f85b5ebbfeaa129fe2e07916d" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "UnverifiedAccount" ADD CONSTRAINT "FK_e7562406292a6e47eb17697ccbd" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "UnverifiedAccount" DROP CONSTRAINT "FK_e7562406292a6e47eb17697ccbd"`);
    await queryRunner.query(`ALTER TABLE "Password" DROP CONSTRAINT "FK_84f85b5ebbfeaa129fe2e07916d"`);
    await queryRunner.query(`ALTER TABLE "PasswordReset" DROP CONSTRAINT "FK_1aa875e542fc0ed2be1ceb00c94"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP CONSTRAINT "FK_fba6bda168431a242bd8f0e42f0"`);
    await queryRunner.query(`ALTER TABLE "Donation" DROP CONSTRAINT "FK_59c1cb9a0762dcd7fd19a1a9098"`);
    await queryRunner.query(`ALTER TABLE "OperationHours" DROP CONSTRAINT "FK_c6c655044bd021a89231b4b31da"`);
    await queryRunner.query(`ALTER TABLE "Organization" DROP CONSTRAINT "FK_1163449e5a53ab64ad2536b4550"`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP CONSTRAINT "FK_6908e72e533a706c1d61f85dab7"`);
    await queryRunner.query(`DROP TABLE "UnverifiedAccount"`);
    await queryRunner.query(`DROP TABLE "Password"`);
    await queryRunner.query(`DROP TABLE "PasswordReset"`);
    await queryRunner.query(`DROP INDEX "IDX_c8782447aa50983c50fa634d9c"`);
    await queryRunner.query(`DROP TABLE "Account"`);
    await queryRunner.query(`DROP TYPE "account_accounttype_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_770ca810f803f6d59384204d21"`);
    await queryRunner.query(`DROP TABLE "Donation"`);
    await queryRunner.query(`DROP TYPE "donation_donationstatus_enum"`);
    await queryRunner.query(`DROP TABLE "OperationHours"`);
    await queryRunner.query(`DROP TYPE "operationhours_weekday_enum"`);
    await queryRunner.query(`DROP TABLE "Organization"`);
    await queryRunner.query(`DROP INDEX "IDX_50f45bd1bc452467959eb2d86d"`);
    await queryRunner.query(`DROP TABLE "ContactInfo"`);
  }

}
