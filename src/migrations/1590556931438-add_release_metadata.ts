import { MigrationInterface, QueryRunner } from 'typeorm';

export class addReleaseMetadata1590556931438 implements MigrationInterface {
  name = 'addReleaseMetadata1590556931438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "releaseMbid" TO "releaseMetadataMbid"`, undefined);
    await queryRunner.query(
      `CREATE TABLE "review_release_metadata" ("mbid" character varying NOT NULL, "artistName" character varying NOT NULL, "albumName" character varying NOT NULL, CONSTRAINT "PK_ce0b9be6c24abc98507dba43482" PRIMARY KEY ("mbid"))`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "releaseMetadataMbid"`, undefined);
    await queryRunner.query(`ALTER TABLE "reviews" ADD "releaseMetadataMbid" character varying`, undefined);
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_1ec75740bd83f47e375587ddd6d" FOREIGN KEY ("releaseMetadataMbid") REFERENCES "review_release_metadata"("mbid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_1ec75740bd83f47e375587ddd6d"`, undefined);
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "releaseMetadataMbid"`, undefined);
    await queryRunner.query(`ALTER TABLE "reviews" ADD "releaseMetadataMbid" character varying NOT NULL`, undefined);
    await queryRunner.query(`DROP TABLE "review_release_metadata"`, undefined);
    await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "releaseMetadataMbid" TO "releaseMbid"`, undefined);
  }
}
