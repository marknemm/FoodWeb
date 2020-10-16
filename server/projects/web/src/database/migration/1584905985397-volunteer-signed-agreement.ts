import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class volunteerSignedAgreement1584905985397 implements MigrationInterface {
  name = 'volunteerSignedAgreement1584905985397';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Volunteer' AND column_name = 'signedAgreement')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`ALTER TABLE "Volunteer" RENAME COLUMN "hasEquipment" TO "signedAgreement"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Volunteer" RENAME COLUMN "signedAgreement" TO "hasEquipment"`, undefined);
  }

}
