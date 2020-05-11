import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserNickname1589209030780 implements MigrationInterface {
  name = 'addUserNickname1589209030780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "nickname" character varying NOT NULL`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "nickname"`,
      undefined,
    );
  }
}
