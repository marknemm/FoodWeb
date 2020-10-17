import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class deliveryStartedTime1577933296003 implements MigrationInterface {
  name = 'deliveryStartedTime1577933296003';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" ADD "startTime" TIMESTAMP WITH TIME ZONE`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "Delivery" DROP COLUMN "startTime"`, undefined);
  }

}
