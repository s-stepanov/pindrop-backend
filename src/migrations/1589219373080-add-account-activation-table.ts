import {MigrationInterface, QueryRunner} from "typeorm";

export class addAccountActivationTable1589219373080 implements MigrationInterface {
    name = 'addAccountActivationTable1589219373080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_pending_activations" ("activationHash" character varying NOT NULL, "userId" integer, CONSTRAINT "REL_45d5a58878f2d2d6db7d6bcdfb" UNIQUE ("userId"), CONSTRAINT "PK_b09bee5a55c3401ec29d0bb1f4d" PRIMARY KEY ("activationHash"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user_pending_activations" ADD CONSTRAINT "FK_45d5a58878f2d2d6db7d6bcdfb4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_pending_activations" DROP CONSTRAINT "FK_45d5a58878f2d2d6db7d6bcdfb4"`, undefined);
        await queryRunner.query(`DROP TABLE "user_pending_activations"`, undefined);
    }

}
