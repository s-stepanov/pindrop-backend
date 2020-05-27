import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCoverArt1590559080555 implements MigrationInterface {
  name = 'addCoverArt1590559080555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review_release_metadata" ADD "coverArt" character varying NOT NULL DEFAULT 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/eb777e7a-7d3c-487e-865a-fc83920564a1/d7kpm65-437b2b46-06cd-4a86-9041-cc8c3737c6f0.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZWI3NzdlN2EtN2QzYy00ODdlLTg2NWEtZmM4MzkyMDU2NGExXC9kN2twbTY1LTQzN2IyYjQ2LTA2Y2QtNGE4Ni05MDQxLWNjOGMzNzM3YzZmMC5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.jgGhagSdo7F0atzSBenaqBDiHFUQiHmQQKDIny5cA2o'`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review_release_metadata" DROP COLUMN "coverArt"`, undefined);
  }
}
