import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class profileImgUrlNull1602618068261 implements MigrationInterface {
  name = 'profileImgUrlNull1602618068261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Account" RENAME COLUMN "profileImgUrl" TO "profileImg"`);
    await queryRunner.query(`
      UPDATE  "Account"
      SET     "profileImg" = SUBSTRING("profileImg", (LENGTH("profileImg") - 4), 1)
      WHERE   "profileImg" LIKE '%.svg'
    `);

    await queryRunner.query(`
      UPDATE  "Notification"
      SET     "icon" = SUBSTRING("icon", (LENGTH("icon") - 4), 1)
      WHERE   "icon" LIKE '%.svg'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE  "Notification"
      SET     "icon" = './assets/' || "icon" || '.svg'
      WHERE   "icon" LIKE '%.svg'
    `);

    await queryRunner.query(`
      UPDATE  "Account"
      SET     "profileImg" = './assets/' || "profileImg" || '.svg'
      WHERE   "profileImg" LIKE '%.svg'
    `);
    await queryRunner.query(`ALTER TABLE "Account" RENAME COLUMN "profileImg" TO "profileImgUrl"`);
  }

}
