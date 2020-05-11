import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserRolesAndActivation1589212192490
  implements MigrationInterface {
  name = 'addUserRolesAndActivation1589212192490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("name" character varying NOT NULL, CONSTRAINT "PK_4a77d431a6b2ac981c342b13c94" PRIMARY KEY ("name"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "users_user_role_user_roles" ("usersId" integer NOT NULL, "userRolesName" character varying NOT NULL, CONSTRAINT "PK_961896d679a3ec049ae84b8b19f" PRIMARY KEY ("usersId", "userRolesName"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a6cf61e9909f5741abf9356614" ON "users_user_role_user_roles" ("usersId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1cd7fbbc33dc8f09fa891af41e" ON "users_user_role_user_roles" ("userRolesName") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "accountActive" boolean NOT NULL`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users_user_role_user_roles" ADD CONSTRAINT "FK_a6cf61e9909f5741abf93566147" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users_user_role_user_roles" ADD CONSTRAINT "FK_1cd7fbbc33dc8f09fa891af41e4" FOREIGN KEY ("userRolesName") REFERENCES "user_roles"("name") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `INSERT INTO user_roles VALUES ('default_user'), ('admin')`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_user_role_user_roles" DROP CONSTRAINT "FK_1cd7fbbc33dc8f09fa891af41e4"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users_user_role_user_roles" DROP CONSTRAINT "FK_a6cf61e9909f5741abf93566147"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "accountActive"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1cd7fbbc33dc8f09fa891af41e"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_a6cf61e9909f5741abf9356614"`,
      undefined,
    );
    await queryRunner.query(
      `DROP TABLE "users_user_role_user_roles"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`, undefined);
  }
}
