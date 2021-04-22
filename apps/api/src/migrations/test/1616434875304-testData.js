const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class testdata1616434875304 {
  async up(queryRunner) {
    await queryRunner.query(`

        -- app_fom.project
        INSERT INTO app_fom.project(
            project_id, name, description, fsp_id, district_id, forest_client_number, workflow_state_code,
            commenting_open_date, commenting_closed_date, create_user ) VALUES
        (1, 'Corner of SunTerra village deforestation', 'This is the description of the Corner of ....', 10, 56, 1011, 'INITIAL', '2021-03-03', '2021-04-03', 'testdata')
        , (2, 'Corner of SunFlower village deforestation', 'This is the description of the Corner of the world ....', 10, 43, 1012, 'INITIAL', '2021-03-03', '2021-04-03', 'testdata')
        ;
        
        -- app_fom.public_comment
        INSERT INTO app_fom.public_comment(
            public_comment_id, project_id, comment_scope_code, feedback, name, location, email, phone_number, response_code, response_details, create_user) VALUES
        (10, 1, 'OVERALL', 'Hi there. The trees you are trying to cut are absolutely amazing and the entiry community 
            just love them. Actually, we rely on them for our birds and would like to know if you could go on the other side of the creek and work there.', 'Anonymous', 
            'Quesnel Natural RESOURCE', 'test@test.com', '+14034442266', null, 'I dont really like this comment', 'testdata')
        , (11, 1, 'OVERALL', 'Hi there? When are you actually planning on executing this work? Will there be any further
            notification? I''m planing on building a house very close to where the cut will be, that''s why the
            concern. In addition, how long will your work take?', 'Anonymous', 
            'Fort Nelson Natural Resource', 'anonymous@test.com', null, 'CONSIDERED', 'This comment will be dealt with later', 'testdata')
        ;

        -- app_fom.submission
        INSERT INTO app_fom.submission(submission_id, project_id, submission_type_code, create_user) values
        (20, 1, 'PROPOSED', 'testdata')
        ;
       
        -- app_fom.cut_block
		INSERT INTO app_fom.cut_block (cut_block_id, submission_id, name, planned_development_date, geometry, create_user) VALUES
		(200, 20, 'my cut block', '2021-04-22', ST_GeomFromText('POLYGON((1474614 555392, 1474818 555392, 1474818 555080, 1474614 555080, 1474614 555392))', 3005), 'testdata')
		;
          
		-- app_fom.road_section
		INSERT INTO app_fom.road_section(road_section_id, submission_id, name, planned_development_date, geometry, create_user) VALUES 
		(201, 20, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1473871.1 555638.3, 1474543.9 555285.1, 1474940.2 555143.5)', 3005), 'testdata')		
		;

		-- Update geometric-derived fields to simulate what the application would do
		update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id = 20;
		update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id = 20;

		with submission_geometries as (
			select submission_id, geometry from app_fom.cut_block 
			union 
			select submission_id, geometry from app_fom.road_section  
			union 
			select submission_id, geometry from app_fom.retention_area ra 
		)
		update app_fom.submission s set geometry = (select ST_centroid(ST_COLLECT(g.geometry)) from submission_geometries g where g.submission_id = s.submission_id) 
		where s.submission_id = 20;

        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
        DELETE FROM app_fom.public_comment where public_comment_id in (10,11);
        DELETE FROM app_fom.cut_block where submission_id in (20);
        DELETE FROM app_fom.road_section where submission_id in (20);
        DELETE FROM app_fom.submission where submission_id in (20);
        DELETE FROM app_fom.project where project_id in (1, 2);
        `);
  }
};
