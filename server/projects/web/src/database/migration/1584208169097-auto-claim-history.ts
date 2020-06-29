import { MigrationInterface, QueryRunner } from 'typeorm';

export class autoClaimHistory1584208169097 implements MigrationInterface {
  name = 'autoClaimHistory1584208169097'

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'AutoClaimHistory')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_041c7e2080cb98f27cad92795de"`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615"`, undefined);
    await queryRunner.query(`CREATE TABLE "AutoClaimHistory" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "claimId" integer, CONSTRAINT "REL_eec29d34cc30cf3cad99b17482" UNIQUE ("claimId"), CONSTRAINT "PK_afb4bf5d58c0d5657030c8b3bbb" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_93d60330979df192af26a58e9f" ON "AutoClaimHistory" ("timestamp") `, undefined);
    await queryRunner.query(`ALTER TABLE "AutoClaimHistory" ADD CONSTRAINT "FK_eec29d34cc30cf3cad99b17482b" FOREIGN KEY ("claimId") REFERENCES "DonationClaim"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_041c7e2080cb98f27cad92795de" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615"`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_041c7e2080cb98f27cad92795de"`, undefined);
    await queryRunner.query(`ALTER TABLE "AutoClaimHistory" DROP CONSTRAINT "FK_ab76f4c29bf1240610d260f2d3e"`, undefined);
    await queryRunner.query(`ALTER TABLE "AutoClaimHistory" DROP CONSTRAINT "FK_eec29d34cc30cf3cad99b17482b"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_93d60330979df192af26a58e9f"`, undefined);
    await queryRunner.query(`DROP TABLE "AutoClaimHistory"`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_041c7e2080cb98f27cad92795de" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

}
