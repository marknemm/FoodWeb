import { genSalt, hash } from 'bcrypt';
import { exec, ExecException } from 'child_process';
import 'dotenv';
import { Connection, createConnection, getConnection, QueryRunner } from 'typeorm';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import _ = require('lodash');
import path = require('path');

/**
 * Generates a development version of the production database and dumps it schema & contents.
 * @return A promise that resolves to the dev dump file pathname.
 */
export async function adminGenDevDataDump(): Promise<string> {
  const devDatabaseName: string = await createDevDatabase();
  try {
    await copyProdToDevDatabase(devDatabaseName);
    await filterDevDatabase(devDatabaseName);
    return await dumpDevDatabase(devDatabaseName);
  } finally {
    // VERY IMPORTANT: Delete the dev database when done, especially if something went wrong along the way!
    await (await getConnection()).query(`DROP DATABASE "${devDatabaseName}"`)
      .catch((err: Error) => console.error(err));
  }
}

/**
 * Creates an empty dev database which will be filled with prod data that has its sensitive data filtered.
 * @return A promise that resolves to the name of the created dev database.
 */
async function createDevDatabase(): Promise<string> {
  const devDatabaseName = `foodwebDev${new Date().getTime()}`;
  const queryRunner: QueryRunner = getConnection().createQueryRunner();
  await queryRunner.query(`CREATE DATABASE "${devDatabaseName}"`);
  await queryRunner.release();
  return devDatabaseName;
}

/**
 * Copies the current production database to a target dev database.
 * @param devDatabaseName The dev database name.
 * @return A promise that resolves once the operation completes.
 */
async function copyProdToDevDatabase(devDatabaseName: string): Promise<void> {
  const devDatabaseUrl: string = genDevDbUrl(devDatabaseName);
  return new Promise<void>((res, rej) =>
    exec(`pg_dump ${process.env.DATABASE_URL} | psql ${devDatabaseUrl}`, (err: ExecException) => {
      if (err) {
        console.error(err.stack);
        rej(new FoodWebError('Copy of production database to dev unexpectedly failed.'));
      } else {
        res();
      }
    })
  );
}

/**
 * Generates a dev database URL based off of a given dev database name.
 * @param devDatabaseName The dev database name.
 * @return The dev database URL.
 */
function genDevDbUrl(devDatabaseName: string): string {
  return process.env.DATABASE_URL.replace(`/${process.env.DATABASE_DATABASE}`, `/${devDatabaseName}`);
}

/**
 * Filters/replaces the dev database's private data.
 * @param devDatabaseName The dev database name.
 * @return A promise that resolves once this operation completes.
 */
async function filterDevDatabase(devDatabaseName: string): Promise<void> {
  const devDbConnection: Connection = await connectToDevDatabase(devDatabaseName);
  const queryRunner: QueryRunner = devDbConnection.createQueryRunner();
  try {
    await queryRunner.startTransaction();
    await createDevDbMetadata(queryRunner);

    // REALLY IMPORTANT: purge/Change all of the very private data!!!
    await replaceDevPasswords(queryRunner);
    await purgeDevPassResetTokens(queryRunner);
    await purgeDevAppSessionsData(queryRunner);
    await replaceDevPassVerificationTokens(queryRunner);

    // Perform all other filtering tasks of less importance.
    await replaceVolunteerNames(queryRunner);
    await replaceEmails(queryRunner);
    await replaceUsernames(queryRunner);
    await replacePhoneNumbers(queryRunner);
    await purgeAudits(queryRunner);
    await purgeNotifications(queryRunner);
    await purgeEventRegistrations(queryRunner);

    // Cleanup dev database query runner & connection!
    await queryRunner.commitTransaction();
  } catch (err) {
    console.error(err);
    throw new FoodWebError('An unexpected error occured while filtering the dev database.');
  } finally {
    // IMPORTANT: Ensure we cleanup resources to avoid memeory leaks!
    queryRunner.release();
    devDbConnection.close();
  }
}

/**
 * Establishes a connection with the new dev database.
 * @param devDatabaseName The dev database name.
 * @return A promise that resolves to the dev database connection.
 */
function connectToDevDatabase(devDatabaseName: string): Promise<Connection> {
  return createConnection({
    name: devDatabaseName,
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: devDatabaseName,
    synchronize: false
  });
}

/**
 * Creates a dev metadata table with info pertaining to the creation process for the database.
 * NOTE: The createTimestamp may be used on developer's local machine to update all dates to relavent ones.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function createDevDbMetadata(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    DROP TABLE IF EXISTS "DevDbMetadata";

    CREATE TABLE "DevDbMetadata" (
      "createTimestamp"                   TIMESTAMP NOT NULL DEFAULT NOW(),
      "replaceDevPasswords"               BOOLEAN   NOT NULL DEFAULT false,
      "purgeDevPassResetTokens"           BOOLEAN   NOT NULL DEFAULT false,
      "purgeDevAppSessionsData"           BOOLEAN   NOT NULL DEFAULT false,
      "replaceDevPassVerificationTokens"  BOOLEAN   NOT NULL DEFAULT false,
      "replaceVolunteerNames"             BOOLEAN   NOT NULL DEFAULT false,
      "replaceEmails"                     BOOLEAN   NOT NULL DEFAULT false,
      "replaceUsernames"                  BOOLEAN   NOT NULL DEFAULT false,
      "replacePhoneNumbers"               BOOLEAN   NOT NULL DEFAULT false,
      "purgeAudits"                       BOOLEAN   NOT NULL DEFAULT false,
      "purgeNotifications"                BOOLEAN   NOT NULL DEFAULT false,
      "purgeEventRegistrations"           BOOLEAN   NOT NULL DEFAULT false
    );

    INSERT INTO "DevDbMetadata" DEFAULT VALUES;
  `);
}

/**
 * Replaces all passwords with the hashed value of 'foodweb' within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replaceDevPasswords(queryRunner: QueryRunner): Promise<void> {
  const salt: string = await genSalt();
  const passwordHash: string = await hash('foodweb', salt);
  await queryRunner.query(`
    UPDATE  "Password"
    SET     "passwordHash" = '${passwordHash}';

    UPDATE  "DevDbMetadata"
    SET     "replaceDevPasswords" = true;
  `);
  await queryRunner.query(``);
}

/**
 * Purges all password reset tokens within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function purgeDevPassResetTokens(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    TRUNCATE "PasswordReset";

    UPDATE  "DevDbMetadata"
    SET     "purgeDevPassResetTokens" = true;
  `);
}

/**
 * Purges all app sessions and data within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function purgeDevAppSessionsData(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    TRUNCATE "AppSession";
    TRUNCATE "AppData";

    UPDATE  "DevDbMetadata"
    SET     "purgeDevAppSessionsData" = true;
  `);
}

/**
 * Replaces all password verification tokens with newly generated random strings within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replaceDevPassVerificationTokens(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    UPDATE  "UnverifiedAccount"
    SET     "verificationToken" = SUBSTR(MD5(RANDOM()::text), 0, 20);

    UPDATE  "DevDbMetadata"
    SET     "replaceDevPassVerificationTokens" = true;
  `);
}

/**
 * Replaces all volunteer first & last names with random permutations of a small set of names.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replaceVolunteerNames(queryRunner: QueryRunner): Promise<void> {
  let firstNames = _.shuffle([
    'David','John','Paul','Mark','James','Andrew','Scott','Steven','Robert','Stephen','William','Craig','Michael','Stuart','Christopher',
    'Alan','Colin','Brian','Kevin','Gary','Richard','Derek','Martin','Thomas','Neil','Barry','Ian','Jason','Iain','Gordon','Alexander',
    'Graeme','Peter','Darren','Graham','George','Kenneth','Allan','Simon','Douglas','Keith','Lee','Anthony','Grant','Ross','Jonathan',
    'Gavin','Nicholas','Joseph','Stewart','Daniel','Edward','Matthew','Donald','Fraser','Garry','Malcolm','Charles','Duncan','Alistair',
    'Raymond','Philip','Ronald','Ewan','Ryan','Francis','Bruce','Patrick','Alastair','Bryan','Marc','Jamie','Hugh','Euan','Gerard','Sean',
    'Wayne','Adam','Calum','Alasdair','Robin','Greig','Angus','Russell','Cameron','Roderick','Norman','Murray','Gareth','Dean','Eric',
    'Adrian','Gregor','Samuel','Gerald','Henry','Justin','Benjamin','Shaun','Callum','Campbell','Frank','Roy','Timothy','Olivia','Emily',
    'Isla','Sophie','Ella','Ava','Amelia','Grace','Freya','Charlotte','Jessica','Lucy','Ellie','Sophia','Aria','Lily','Harper','Mia',
    'Rosie','Millie','Evie','Eilidh','Ruby','Willow','Anna','Maisie','Hannah','Eva','Chloe','Mila','Orla','Isabella','Ivy','Emma',
    'Georgia','Poppy','Robyn','Daisy','Zara','Gracie','Holly','Skye','Esme','Sofia','Erin','Hallie','Molly','Ayla','Emilia','Layla',
    'Katie','Sienna','Niamh','Alice','Amber','Bonnie','Maya','Zoe','Ada','Hollie','Bella','Luna','Thea','Rose','Abigail','Summer','Callie',
    'Hope','Lexi','Iona','Elsie','Leah','Scarlett','Julia','Violet','Myla','Harley','Eve','Imogen','Elizabeth','Cora','Florence','Georgie',
    'Lilly','Matilda','Mirren','Phoebe','Rowan','Lola','Aurora','Evelyn','Brooke','Clara','Lucie','Sadie','Cara','Darcy','Nova','Penelope',
    'Abbie','Aila','Ailsa','Aoife','Lottie','Lyla','Maria'
  ]);
  let lastNames = _.shuffle([
    'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson',
    'Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis',
    'Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall',
    'Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins',
    'Reyes','Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly',
    'Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes',
    'Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez','Powell','Jenkins','Perry','Russell',
    'Sullivan','Bell','Coleman','Butler','Henderson','Barnes','Gonzales','Fisher','Vasquez','Simmons','Romero','Jordan','Patterson',
    'Alexander','Hamilton','Graham','Reynolds','Griffin','Wallace','Moreno','West','Cole','Hayes','Bryant','Herrera','Gibson','Ellis',
    'Tran','Medina','Aguilar','Stevens','Murray','Ford','Castro','Marshall','Owens','Harrison','Fernandez','Mcdonald','Woods','Washington',
    'Kennedy','Wells','Vargas','Henry','Chen','Freeman','Webb','Tucker','Guzman','Burns','Crawford','Olson','Simpson','Porter','Hunter',
    'Gordon','Mendez','Silva','Shaw','Snyder','Mason','Dixon','Munoz','Hunt','Hicks','Holmes','Palmer','Wagner','Black','Robertson','Boyd',
    'Rose','Stone','Salazar','Fox','Warren','Mills','Meyer','Rice','Schmidt','Garza','Daniels','Ferguson','Nichols','Stephens','Soto',
    'Weaver','Ryan','Gardner','Payne','Grant','Dunn','Kelley','Spencer','Hawkins','Arnold','Pierce','Vazquez','Hansen','Peters','Santos',
    'Hart','Bradley','Knight','Elliott','Cunningham','Duncan','Armstrong','Hudson','Carroll','Lane','Riley','Andrews','Alvarado','Ray',
    'Delgado','Berry','Perkins','Hoffman','Johnston','Matthews','Pena','Richards','Contreras','Willis','Carpenter','Lawrence','Sandoval',
    'Guerrero','George','Chapman','Rios','Estrada','Ortega','Watkins','Greene','Nunez','Wheeler','Valdez','Harper','Burke','Larson',
    'Santiago','Maldonado','Morrison','Franklin','Carlson','Austin','Dominguez','Carr','Lawson','Jacobs','Obrien','Lynch','Singh','Vega',
    'Bishop','Montgomery','Oliver','Jensen','Harvey','Williamson','Gilbert','Dean','Sims','Espinoza','Howell','Li','Wong','Reid','Hanson',
    'Le','Mccoy','Garrett','Burton','Fuller','Wang','Weber','Welch','Rojas','Lucas','Marquez','Fields','Park','Yang','Little','Banks',
    'Padilla','Day','Walsh','Bowman','Schultz','Luna','Fowler','Mejia','Davidson','Acosta','Brewer','May','Holland','Juarez','Newman',
    'Pearson','Curtis','Cortez','Douglas','Schneider','Joseph','Barrett','Navarro','Figueroa','Keller','Avila','Wade','Molina','Stanley',
    'Hopkins','Campos','Barnett','Bates','Chambers','Caldwell','Beck','Lambert','Miranda','Byrd','Craig','Ayala','Lowe','Frazier','Powers',
    'Neal','Leonard','Gregory','Carrillo','Sutton','Fleming','Rhodes','Shelton','Schwartz','Norris','Jennings','Watts','Duran','Walters'
  ]).slice(0, firstNames.length);

  const limit = 300;
  let page = 1;
  let numQueried: number;
  let nameIdx = 0;

  do {
    const volunteers: { id: number, accountId: number }[] = await queryRunner.query(`
      SELECT  "Volunteer"."id",
              "Volunteer"."accountId"
      FROM    "Volunteer"
      OFFSET  (${page} - 1) * ${limit}
      LIMIT   ${limit}
    `);
    let bulkUpdateQueryStr = '';
    for (const volunteer of volunteers) {
      bulkUpdateQueryStr += `
        UPDATE  "Volunteer"
        SET     "firstName" = '${firstNames[nameIdx]}',
                "lastName"  = '${lastNames[nameIdx]}'
        WHERE   "Volunteer"."id" = ${volunteer.id};

        UPDATE  "Account"
        SET     "profileImgUrl" = './assets/${lastNames[nameIdx].charAt(0)}.svg'
        WHERE   "Account"."id" = ${volunteer.accountId}
      `;

      if (++nameIdx === firstNames.length) {
        nameIdx = 0;
        firstNames = _.shuffle(firstNames);
        lastNames = _.shuffle(lastNames);
      }
    }
    queryRunner.query(bulkUpdateQueryStr);
    numQueried = volunteers.length;
  } while (numQueried === limit);

  await queryRunner.query(`
    UPDATE  "DevDbMetadata"
    SET     "replaceVolunteerNames" = true;
  `);
}

/**
 * Replaces all account emails with either organization or volunteer name derivative.
 * Replaces all contact info override emails with derivative of constant string and contact info ID.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replaceEmails(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    UPDATE  "ContactInfo"
    SET     "email" = COALESCE(
              (
                SELECT
                  CASE WHEN ("Organization"."name" IS NOT NULL) THEN
                    (REPLACE("Organization"."name", ' ', '') || '.' || "Organization"."id"::TEXT || '@foodweb.com')
                  ELSE
                    ("Volunteer"."firstName" || '.' || "Volunteer"."lastName" || '.' || "Volunteer"."id"::TEXT || '@foodweb.com')
                  END
                FROM      "Account"
                LEFT JOIN "Organization"  ON "Organization"."accountId" = "Account"."id"
                LEFT JOIN "Volunteer"     ON "Volunteer"."accountId" = "Account"."id"
                WHERE "Account"."contactInfoId" = "ContactInfo"."id"
              ),
              ('override.' || "ContactInfo"."id"::TEXT || '@foodweb.com')
            );

    UPDATE  "DevDbMetadata"
    SET     "replaceEmails" = true;
  `);
}

/**
 * Replaces all usernames. Every account, but the one with ID of 1 will use their email address prefix
 * (eveything before '@') as their username. The account with ID 1 will be given the username 'foodweb'.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replaceUsernames(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    UPDATE "Account"
    SET "username" = CASE
      WHEN ("id" = 1) THEN 'foodweb'
      ELSE SPLIT_PART(
        (
          SELECT  "email"
          FROM    "ContactInfo"
          WHERE   "Account"."contactInfoId" = "ContactInfo"."id"
        ), '@', 1
      )
    END;

    UPDATE  "DevDbMetadata"
    SET     "replaceUsernames" = true;
  `);
}

/**
 * Replaces all phone numbers with randomly generated ones.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function replacePhoneNumbers(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    UPDATE  "ContactInfo"
    SET     "phoneNumber" = (
      '(' || FLOOR(RANDOM() * 899 + 100)::TEXT || ') '
      || FLOOR(RANDOM() * 899 + 100)::TEXT || '-'
      || FLOOR(RANDOM() * 8999 + 1000)::TEXT
    );

    UPDATE  "DevDbMetadata"
    SET     "replacePhoneNumbers" = true;
  `);
}

/**
 * Purges all audits within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function purgeAudits(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    TRUNCATE "AuditAccountMap";
    TRUNCATE "Audit" CASCADE;

    UPDATE  "DevDbMetadata"
    SET     "purgeAudits" = true;
  `);
}

/**
 * Purges all notifications within the dev database.
 * @param queryRunner The dev database query runner.
 * @return A promise that resolves once this operation completes.
 */
async function purgeNotifications(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    TRUNCATE "Notification";

    UPDATE  "DevDbMetadata"
    SET     "purgeNotifications" = true;
  `);
}

async function purgeEventRegistrations(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    TRUNCATE "EventRegistration";

    UPDATE  "DevDbMetadata"
    SET     "purgeEventRegistrations" = true;
  `);
}

/**
 * Dumps the schema & contents of a given dev database.
 * @param devDatabaseName The dev database name.
 * @return A promise that resolves to the dev dump file pathname.
 */
function dumpDevDatabase(devDatabaseName: string): Promise<string> {
  const devDatabaseUrl: string = genDevDbUrl(devDatabaseName);
  const devDumpPathname: string = path.join(global['serverDbDumpDir'], `${devDatabaseName}.pgsql`);
  return new Promise<string>((res, rej) =>
    exec(`pg_dump ${devDatabaseUrl} > ${devDumpPathname}`, (err: ExecException) => {
      if (err) {
        console.error(err);
        rej(new FoodWebError('Dump of dev database failed.'));
      } else {
        res(devDumpPathname);
      }
    })
  );
}
