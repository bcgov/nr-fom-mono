require('dotenv').config();
const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class testdata1616434875304 {
  async up(queryRunner) {
    var key = process.env.DATA_ENCRYPTION_KEY || 'defaultkey';
    await queryRunner.query(`

        -- Test Data Overview
        -- Project #1 - INITIAL state, no submissions
        -- Project #2 - INITIAL state, proposed submission
        -- Project #3 - COMMENTING_OPEN state, proposed submission, lots of public comments
        -- Project #4 - COMMENTING_CLOSED state, proposed submission
        -- Project #5 - COMMENTING_CLOSED state, proposed + final submissions
        -- Project #6 - FINALIZED state, proposed + final submission, identical shapes
        -- Project #7 - PUBLISHED state, proposed submission
        -- Project #8 - EXPIRED state, proposed + final submission

        -- app_fom.project 
        INSERT INTO app_fom.project(
            project_id, name, description, fsp_id, district_id, forest_client_number, workflow_state_code,
            commenting_open_date, commenting_closed_date, create_user ) VALUES
        (1, 'Fake name 1', 'Initial no submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, null, 1011, 'INITIAL', null, null, 'testdata')
        , (2, 'Fake name 2 a bit longer', 'Initial with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 43, 1012, 'INITIAL', '2021-03-03', null, 'testdata')
        , (3, 'Fake name 3 with lots of comments', 'Commenting open with submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 43, 1012, 'COMMENT_OPEN', '2021-04-01', '2022-04-01', 'testdata')
        , (4, 'Fake name 4 50 char long 123456789 123456789 123456789', 'Commenting closed with only proposed submission project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 56, 1016, 'COMMENT_CLOSED', '2021-02-01', '2021-03-01', 'testdata')
        , (5, 'Fake name 5', 'Commenting closed with proposed + final submissions project. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 56, 1016, 'COMMENT_CLOSED', '2021-03-01', '2021-03-31', 'testdata')
        , (6, 'Fake name 6', 'Finalized project with identical proposed/final shapes. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 46, 1021, 'FINALIZED', '2021-01-01', '2021-01-31', 'testdata')
        , (7, 'Fake name 7', 'Published project with proposed submission. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 46, 1021, 'PUBLISHED', '2022-04-01', '2022-05-01', 'testdata')
        , (8, 'Fake name 8', 'Expired project with proposed+final submissions. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. ', 10, 18, 1026, 'EXPIRED', '2019-12-01', '2019-12-31', 'testdata')
        ;
        
        -- app_fom.submission
        INSERT INTO app_fom.submission(submission_id, project_id, submission_type_code, create_user) values
        (20, 2, 'PROPOSED', 'testdata')
        , (30, 3, 'PROPOSED', 'testdata')
        , (40, 4, 'PROPOSED', 'testdata')
        , (50, 5, 'PROPOSED', 'testdata')
        , (51, 5, 'FINAL', 'testdata')
        , (60, 6, 'PROPOSED', 'testdata')
        , (61, 6, 'FINAL', 'testdata')
        , (70, 7, 'FINAL', 'testdata')
        , (80, 8, 'PROPOSED', 'testdata')
        , (81, 8, 'FINAL', 'testdata')
        ;
       
        -- app_fom.cut_block
		INSERT INTO app_fom.cut_block (cut_block_id, submission_id, name, planned_development_date, geometry, create_user) VALUES
		(200, 20, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1474614 555392, 1474818 555392, 1474818 555080, 1474614 555080, 1474614 555392))', 3005), 'testdata')
		, (300, 30, 'my cut block with comments', '2022-04-01', ST_GeomFromText('POLYGON((1474614 555392, 1474818 555392, 1474818 555080, 1474614 555080, 1474614 555392))', 3005), 'testdata')
		, (400, 40, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1474714 555492, 1474918 555492, 1474918 555180, 1474714 555280, 1474714 555492))', 3005), 'testdata')
		, (500, 50, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1454714 555492, 1454918 555492, 1454918 555180, 1454714 555280, 1454714 555492))', 3005), 'testdata')
		, (510, 51, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1454814 555392, 1455018 555392, 1455018 555080, 1454814 555180, 1454814 555392))', 3005), 'testdata')
		, (600, 60, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1090000 850000, 1100000 860000, 1110000 850000, 1110000 840000, 1090000 840000, 1090000 850000))', 3005), 'testdata')
		, (610, 61, 'my cut block', '2022-04-01', ST_GeomFromText('POLYGON((1090000 850000, 1100000 860000, 1110000 850000, 1110000 840000, 1090000 840000, 1090000 850000))', 3005), 'testdata')
		, (700, 70, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		, (800, 80, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		, (810, 81, null, '2023-04-01', ST_GeomFromText('POLYGON((1300000 750000, 1310000 760000, 1320000 750000, 1320000 740000, 1300000 740000, 1300000 750000))', 3005), 'testdata')
		;

		-- app_fom.road_section
		INSERT INTO app_fom.road_section(road_section_id, submission_id, name, planned_development_date, geometry, create_user) VALUES 
		(200, 20, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1473871.1 555638.3, 1474543.9 555285.1, 1474940.2 555143.5)', 3005), 'testdata')		
		, (300, 30, 'my road with comments', '2021-04-23', ST_GeomFromText('LINESTRING(1473871.1 555638.3, 1474543.9 555285.1, 1474940.2 555143.5)', 3005), 'testdata')		
		, (600, 60, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1090000 850000, 1085000 855000, 1080000 845000)', 3005), 'testdata')		
		, (610, 61, 'my road', '2021-04-23', ST_GeomFromText('LINESTRING(1090000 850000, 1085000 855000, 1080000 845000)', 3005), 'testdata')		
		;

        -- app_fom.retention_area
		INSERT INTO app_fom.retention_area(retention_area_id, submission_id, geometry, create_user) VALUES 
		(300, 30, ST_GeomFromText('POLYGON((1474750 555200, 1474950 555200, 1474950 555080, 1474750 555080, 1474750 555200))', 3005), 'testdata')
		, (600, 60, ST_GeomFromText('POLYGON((1095000 853000, 1100000 857000, 1105000 853000, 1100000 846000, 1095000 853000))', 3005), 'testdata')
		, (610, 61, ST_GeomFromText('POLYGON((1095000 853000, 1100000 857000, 1105000 853000, 1100000 846000, 1095000 853000))', 3005), 'testdata')
		;

		-- Update geometric-derived fields to simulate what the application would do
		update app_fom.cut_block set planned_area_ha = ST_AREA(geometry)/10000 where submission_id < 1000;
		update app_fom.road_section set planned_length_km  = ST_Length(geometry)/1000 where submission_id < 1000;

		with project_geometries as (
			select s.project_id, cb.geometry from app_fom.cut_block cb join app_fom.submission s on cb.submission_id = s.submission_id 
			union 
			select s.project_id, rs.geometry from app_fom.road_section rs join app_fom.submission s on rs.submission_id = s.submission_id 
			union 
			select s.project_id, ra.geometry from app_fom.retention_area ra join app_fom.submission s on ra.submission_id = s.submission_id
		)
		update app_fom.project p set 
			geometry_latlong = (select ST_Transform(ST_centroid(ST_COLLECT(g.geometry)),4326) from project_geometries g where g.project_id = p.project_id),
            update_timestamp = now(),
			update_user = 'testdata',
            revision_count = (select revision_count+1 from app_fom.project p2 where p.project_id = p2.project_id )
		where p.project_id < 1000;

        -- app_fom.public_comment - mix of anonymous and public comments.
        INSERT INTO app_fom.public_comment(
            public_comment_id, project_id, comment_scope_code, scope_cut_block_id, name, location, email, phone_number, response_code, response_details, create_user, feedback) VALUES
        (30, 3, 'OVERALL', null, 'John Smith', 'Prince George', 'john.smith@fakedomain.com', '+12345551234', 'CONSIDERED', 'I dont really like this comment', 'testdata', 
            'Hi there. The trees you are trying to cut are absolutely amazing and the entiry community just love them. Actually, we rely on them for our birds and would like to know if you could go on the other side of the creek and work there.')
        , (31, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Hi there? When are you actually planning on executing this work? Will there be any further notification? I''m planing on building a house very close to where the cut will be, that''s why the concern. In addition, how long will your work take?')
        , (32, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (33, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (34, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (35, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (36, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (37, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (38, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (39, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (40, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (41, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (42, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (43, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (44, 3, 'CUT_BLOCK', 300, 'Some Person', 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
            'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        , (45, 3, 'OVERALL', null, null, null, null, null, null, null, 'testdata',
            'Anonymous feedback from someone. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        ;

        -- INSERT INTO app_fom.public_comment(
        --    public_comment_id, project_id, comment_scope_code, scope_cut_block_id, name, location, email, phone_number, response_code, response_details, create_user, feedback) VALUES
        -- (50, 3, 'OVERALL', null, pgp_sym_encrypt('Some Person', '${key}'), 'Some Location', 'some.person@some.domain.ca', '1234567890', null, null, 'testdata',
        --    'This is some feedback from a public citizen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        -- ;

        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
        DELETE FROM app_fom.public_comment where public_comment_id < 1000;
        DELETE FROM app_fom.cut_block where submission_id < 1000;
        DELETE FROM app_fom.road_section where submission_id < 1000;
        DELETE FROM app_fom.retention_area where submission_id < 1000;
        DELETE FROM app_fom.submission where submission_id < 1000;
        DELETE FROM app_fom.project where project_id < 1000;
        `);
  }
};
