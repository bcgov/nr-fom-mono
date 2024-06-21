const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class SimplifySpatialGeometry1718643595423 {
    async up(queryRunner) {
        console.log(
            'Starting geometry simplification (update geometry column in cut_block, road_section and retention_area table) migration'
        );
        await queryRunner.query(`
    
            -- update geometry column to apply the simplification algorithm in cut_block table
            UPDATE app_fom.cut_block SET geometry=ST_SimplifyPreserveTopology(geometry, 2.5);

            -- update geometry column to apply the simplification algorithm in retention_area table
            UPDATE app_fom.retention_area SET geometry=ST_SimplifyPreserveTopology(geometry, 2.5);

            -- update geometry column to apply the simplification algorithm in road_section table
            UPDATE app_fom.road_section SET geometry=ST_SimplifyPreserveTopology(geometry, 2.5);
        `);
    }

    async down(queryRunner) {
        console.log(
            'ERROR: Apply simplification algorithm on geometry cannot be reversed.'
        );
    }
};