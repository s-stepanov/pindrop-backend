import {MigrationInterface, QueryRunner} from "typeorm";

export class addReviewsVoting1589820429130 implements MigrationInterface {
    name = 'addReviewsVoting1589820429130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review_votes" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "userId" integer, "reviewId" integer, CONSTRAINT "UQ_dff9fe2e660dfcac9542bc06c1d" UNIQUE ("userId", "reviewId"), CONSTRAINT "PK_687569add3c5a70950438fa0cee" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "reviews" ADD "rating" integer NOT NULL DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "review_votes" ADD CONSTRAINT "FK_f34aa40b63e1adedf8623254045" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "review_votes" ADD CONSTRAINT "FK_35fdcea131e84362d9eb6573ce8" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review_votes" DROP CONSTRAINT "FK_35fdcea131e84362d9eb6573ce8"`, undefined);
        await queryRunner.query(`ALTER TABLE "review_votes" DROP CONSTRAINT "FK_f34aa40b63e1adedf8623254045"`, undefined);
        await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "rating"`, undefined);
        await queryRunner.query(`DROP TABLE "review_votes"`, undefined);
    }

}
