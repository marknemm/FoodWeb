import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class donorReceiverEntities1570456199780 implements MigrationInterface {
  name = 'donorReceiverEntities1570456199780';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Receiver')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`CREATE TABLE "Receiver" ("id" SERIAL NOT NULL, "autoReceiver" boolean NOT NULL, "organizationId" integer, CONSTRAINT "REL_893b416fd28748e0ca0ad60123" UNIQUE ("organizationId"), CONSTRAINT "PK_1423a4d57917f13f718bf54f6cf" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "Donor" ("id" SERIAL NOT NULL, "organizationId" integer, CONSTRAINT "REL_0dc5ba96d93634bb232a2979b9" UNIQUE ("organizationId"), CONSTRAINT "PK_e8719874967684820aa4c43c042" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "Receiver" ADD CONSTRAINT "FK_893b416fd28748e0ca0ad601239" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "Donor" ADD CONSTRAINT "FK_0dc5ba96d93634bb232a2979b9a" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    const receiverOrgIds: { id: number }[] = await queryRunner.query(`
      SELECT "Organization"."id"
      FROM "Organization"
      INNER JOIN "Account" ON "Organization"."accountId" = "Account"."id"
      WHERE "Account"."accountType" = 'Receiver'
    `);
    const donorOrgIds: { id: number }[] = await queryRunner.query(`
      SELECT "Organization"."id"
      FROM "Organization"
      INNER JOIN "Account" ON "Organization"."accountId" = "Account"."id"
      WHERE "Account"."accountType" = 'Donor'
    `);
    for (const receiverOrgId of receiverOrgIds) {
      await queryRunner.query(`
        INSERT INTO "Receiver" ("organizationId" ,"autoReceiver")
        VALUES ($1, true)
      `, [receiverOrgId.id]);
    }
    for (const donorOrgId of donorOrgIds) {
      await queryRunner.query(`
        INSERT INTO "Donor" ("organizationId")
        VALUES ($1)
      `, [donorOrgId.id]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Donor" DROP CONSTRAINT "FK_0dc5ba96d93634bb232a2979b9a"`);
    await queryRunner.query(`ALTER TABLE "Receiver" DROP CONSTRAINT "FK_893b416fd28748e0ca0ad601239"`);
    await queryRunner.query(`DROP TABLE "Donor"`);
    await queryRunner.query(`DROP TABLE "Receiver"`);
  }
}
