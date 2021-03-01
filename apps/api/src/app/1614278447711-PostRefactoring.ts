import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1614278447711 implements MigrationInterface {

    public async up( queryRunner: QueryRunner ): Promise<void> {
                await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "title" TO "name"`);

    }

    public async down( queryRunner: QueryRunner ): Promise<void> {
                await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "name" TO "title"`); // reverts things made in "up" method

    }

}
