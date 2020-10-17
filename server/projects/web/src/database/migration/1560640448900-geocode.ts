import { MigrationInterface, QueryRunner } from 'typeorm';
import { ContactInfo, geocode, GeographyLocation } from '~web/helpers/map/geocoder';

// tslint:disable-next-line: class-name
export class geocode1560640448900 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ContactInfo' AND column_name = 'location')`
    ))[0].exists;
    if (alreadyCreated) { return; }
    await queryRunner.query(`ALTER TABLE "ContactInfo" ADD "location" geography`);
    const contactInfoArr: ContactInfo[] = await queryRunner.query('SELECT * FROM "ContactInfo"');
    for (const contactInfo of contactInfoArr) {
      const location: GeographyLocation = await geocode(contactInfo).catch(
        () => ({ type: 'Point', coordinates: [0, 0] }) // If fake address encountered, gen fake coordinates
      );
      await queryRunner.query(
        `UPDATE "ContactInfo" SET location = ST_SETSRID(ST_MAKEPOINT($1, $2), 4326) WHERE id = $3`,
        [location.coordinates[0], location.coordinates[1], contactInfo.id]
      );
    }
    await queryRunner.query(`ALTER TABLE "ContactInfo" ALTER COLUMN "location" SET NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_b89b220cadc68103e4f75edac7" ON "ContactInfo" USING GiST ("location") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_b89b220cadc68103e4f75edac7"`);
    await queryRunner.query(`ALTER TABLE "ContactInfo" DROP COLUMN "location"`);
  }
}
