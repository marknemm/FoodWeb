import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class donationOrganizationVolunteerColumnIndexRefactor1580662267033 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Organization' AND column_name = 'name')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`DROP INDEX "IDX_e4d91b066fcc5a2738f56d0e0c"`);
    await queryRunner.query(`DROP INDEX "IDX_770ca810f803f6d59384204d21"`);

    await queryRunner.query(`ALTER TABLE "Organization" RENAME COLUMN "organizationName" TO "name"`);
    await queryRunner.query(`ALTER TABLE "Organization" RENAME COLUMN "organizationInfo" TO "description"`);

    await queryRunner.query(`CREATE INDEX "organizationNameIdx" ON "Organization" (LOWER("name"))`);
    await queryRunner.query(`CREATE INDEX "volunteerNameIdx" ON "Volunteer" (LOWER("lastName"), LOWER("firstName"))`);
    await queryRunner.query(`CREATE INDEX "donorNameIdx" ON "Donation" (LOWER("donorLastName"), LOWER("donorFirstName"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "donorNameIdx"`);
    await queryRunner.query(`DROP INDEX "volunteerNameIdx"`);
    await queryRunner.query(`DROP INDEX "organizationNameIdx"`);

    await queryRunner.query(`ALTER TABLE "Organization" RENAME COLUMN "description" TO "organizationInfo"`);
    await queryRunner.query(`ALTER TABLE "Organization" RENAME COLUMN "name" TO "organizationName"`);

    await queryRunner.query(`CREATE INDEX "IDX_770ca810f803f6d59384204d21" ON "Donation" ("donorLastName")`);
    await queryRunner.query(`CREATE INDEX "IDX_e4d91b066fcc5a2738f56d0e0c" ON "Volunteer" ("lastName")`);
  }

}
