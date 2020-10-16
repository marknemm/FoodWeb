import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line: class-name
export class featuredEvent1581473265479 implements MigrationInterface {
  name = 'featuredEvent1581473265479';

  public async up(queryRunner: QueryRunner): Promise<any> {
    const alreadyCreated: boolean = (await queryRunner.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'FeaturedEvent')`
    ))[0].exists;
    if (alreadyCreated) { return; }

    await queryRunner.query(`DROP INDEX "IDX_adc757ce53870cb8d536fab1c0"`, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" RENAME COLUMN "eventTitleDate" TO "featuredEventId"`, undefined);
    await queryRunner.query(`CREATE TABLE "FeaturedEvent" ("id" SERIAL NOT NULL, "city" character varying NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "description" character varying NOT NULL, "durationMins" integer, "postalCode" character varying NOT NULL, "showUntil" TIMESTAMP WITH TIME ZONE NOT NULL, "signupCompleteMsg" character varying NOT NULL DEFAULT '', "signupTitle" character varying NOT NULL DEFAULT '', "stateProvince" character varying NOT NULL, "streetAddress" character varying NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_c321a2a7a69c654ce6b66a58165" PRIMARY KEY ("id"))`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_e94bf8c586c57df55287a7889e" ON "FeaturedEvent" ("date") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_f8ac8e48048300367947af4acb" ON "FeaturedEvent" ("showUntil") `, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" DROP COLUMN "featuredEventId"`, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" ADD "featuredEventId" integer`, undefined);

    await queryRunner.query(`
      INSERT INTO "FeaturedEvent" (
        "title",
        "date",
        "durationMins",
        "showUntil",
        "description",
        "streetAddress",
        "city",
        "stateProvince",
        "postalCode",
        "signupCompleteMsg",
        "signupTitle"
      ) VALUES (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2019-09-05T21:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2019-09-05T22:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
        '140 Pearl Street',
        'Buffalo',
        'NY',
        '14202',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-01-22T17:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-01-22T18:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
        '140 Pearl Street',
        'Buffalo',
        'NY',
        '14202',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-02-10T23:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-02-11T00:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>',
        '1595 N. French Road',
        'Getzville',
        'NY',
        '14068',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-03-12T22:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-03-12T23:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
        '140 Pearl Street',
        'Buffalo',
        'NY',
        '14202',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-04-06T22:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-04-06T23:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
        '140 Pearl Street',
        'Buffalo',
        'NY',
        '14202',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-05-12T22:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-05-12T23:00:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at the <strong>Hindu Cultural Society</strong>',
        '1595 N. French Road',
        'Getzville',
        'NY',
        '14068',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      ), (
        'Volunteer Driver Training',
        TO_TIMESTAMP('2020-06-08T21:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        60,
        TO_TIMESTAMP('2020-06-08T22:30:00.000Z', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'Signup for our next volunteer training at <strong>Hodgson Russ</strong>',
        '140 Pearl Street',
        'Buffalo',
        'NY',
        '14202',
        'Signup Successful - We look forward to seeing you at the training!',
        'Training Signup'
      )
    `);

    await queryRunner.query(`
      UPDATE  "EventRegistration"
      SET     "featuredEventId" = 1
      WHERE   "id" <= 11
    `);

    await queryRunner.query(`
      UPDATE  "EventRegistration"
      SET     "featuredEventId" = 2
      WHERE   "id" > 11 AND "id" <= 14
    `);

    await queryRunner.query(`
      UPDATE  "EventRegistration"
      SET     "featuredEventId" = 3
      WHERE   "id" = 15
    `);

    await queryRunner.query(`
      UPDATE  "EventRegistration"
      SET     "featuredEventId" = 4
      WHERE   "id" > 15
    `);

    await queryRunner.query(`ALTER TABLE "EventRegistration" ADD CONSTRAINT "FK_afcaa54b4571a3556506f0ebe08" FOREIGN KEY ("featuredEventId") REFERENCES "FeaturedEvent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "EventRegistration" DROP CONSTRAINT "FK_afcaa54b4571a3556506f0ebe08"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_7a31b3a0e80a0784368db77a99"`, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" DROP COLUMN "featuredEventId"`, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" ADD "featuredEventId" character varying NOT NULL`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_f8ac8e48048300367947af4acb"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_e94bf8c586c57df55287a7889e"`, undefined);
    await queryRunner.query(`DROP TABLE "FeaturedEvent"`, undefined);
    await queryRunner.query(`ALTER TABLE "EventRegistration" RENAME COLUMN "featuredEventId" TO "eventTitleDate"`, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_adc757ce53870cb8d536fab1c0" ON "EventRegistration" ("eventTitleDate") `, undefined);
  }

}
