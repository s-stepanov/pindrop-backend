import {MigrationInterface, QueryRunner} from "typeorm";

export class addReviewsTable1589787515747 implements MigrationInterface {
    name = 'addReviewsTable1589787515747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "releaseScore" integer NOT NULL, "releaseMbid" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountActive" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountActive" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_48770372f891b9998360e4434f3" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_48770372f891b9998360e4434f3"`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountActive" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "accountActive" DROP DEFAULT`, undefined);
        await queryRunner.query(`DROP TABLE "reviews"`, undefined);
    }

}
