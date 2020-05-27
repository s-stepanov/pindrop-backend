import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeVoteActionColumn1590570902898 implements MigrationInterface {
  name = 'changeVoteActionColumn1590570902898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review_votes" DROP COLUMN "action"`, undefined);
    await queryRunner.query(`ALTER TABLE "review_votes" ADD "action" integer DEFAULT 0`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review_votes" DROP COLUMN "action"`, undefined);
    await queryRunner.query(`ALTER TABLE "review_votes" ADD "action" character varying`, undefined);
  }
}
