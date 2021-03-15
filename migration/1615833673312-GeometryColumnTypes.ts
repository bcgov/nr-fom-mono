import {MigrationInterface, QueryRunner} from "typeorm";

export class GeometryColumnTypes1615833673312 implements MigrationInterface {

    // Configure specific geometry types for each column
    // Use BC-Albers (3005) coordinate reference system as per client standards.
    // Unclear whether the initialize-tables migration does this properly or not.
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE submission ALTER COLUMN geometry TYPE geometry(point, 3005);
            ALTER TABLE cut_block ALTER COLUMN geometry TYPE geometry(polygon, 3005);
            ALTER TABLE retention_area ALTER COLUMN geometry TYPE geometry(polygon, 3005);
            ALTER TABLE road_section ALTER COLUMN geometry TYPE geometry(linestring, 3005);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE submission ALTER COLUMN geometry TYPE geometry;
            ALTER TABLE cut_block ALTER COLUMN geometry TYPE geometry;
            ALTER TABLE retention_area ALTER COLUMN geometry TYPE geometry;
            ALTER TABLE road_section ALTER COLUMN geometry TYPE geometry;
        `);
    }

}
