import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class claimDeliveryReqHistory1578251033011 implements MigrationInterface {
  name = 'claimDeliveryReqHistory1578251033011';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ClaimReqHistory')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`CREATE TABLE "ClaimReqHistory" ("id" SERIAL NOT NULL, "donationId" integer, "receiverAccountId" integer, CONSTRAINT "PK_d0bf81f6deff15dcc19576e77bc" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`CREATE TABLE "DeliveryReqHistory" ("id" SERIAL NOT NULL, "donationId" integer, "volunteerAccountId" integer, CONSTRAINT "PK_5ad04e6cbfbdbcdbaf4db984f9c" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_041c7e2080cb98f27cad92795de" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" ADD CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615" FOREIGN KEY ("receiverAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "DeliveryReqHistory" ADD CONSTRAINT "FK_cf76f38185c34c5f14dbaa06fd9" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    await queryRunner.query(`ALTER TABLE "DeliveryReqHistory" ADD CONSTRAINT "FK_19b86e3403724aeb2b20677c189" FOREIGN KEY ("volunteerAccountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "DeliveryReqHistory" DROP CONSTRAINT "FK_19b86e3403724aeb2b20677c189"`, undefined);
    await queryRunner.query(`ALTER TABLE "DeliveryReqHistory" DROP CONSTRAINT "FK_cf76f38185c34c5f14dbaa06fd9"`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_d2a40342e323cc2e3dbecb44615"`, undefined);
    await queryRunner.query(`ALTER TABLE "ClaimReqHistory" DROP CONSTRAINT "FK_041c7e2080cb98f27cad92795de"`, undefined);
    await queryRunner.query(`DROP TABLE "DeliveryReqHistory"`, undefined);
    await queryRunner.query(`DROP TABLE "ClaimReqHistory"`, undefined);
  }

}
