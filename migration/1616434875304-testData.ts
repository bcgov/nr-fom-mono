import {MigrationInterface, QueryRunner} from "typeorm";

export class testdata1616434875304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
            public_comment_id, project_id, feedback, name, location, email, phone_number, response_code, response_details, create_user) VALUES
        (10, 1, 'Hi there. The trees you are trying to cut are absolutely amazing and the entiry community 
            just love them. Actually, we rely on them for our birds and would like to know if you could go on the other side of the creek and work there.', 'Anonymous', 
            'Quesnel Natural RESOURCE', 'test@test.com', '+14034442266', null, 'I dont really like this comment', 'testdata')
        , (11, 1, 'Hi there? When are you actually planning on executing this work? Will there be any further
            notification? I''m planing on building a house very close to where the cut will be, that''s why the
            concern. In addition, how long will your work take?', 'Anonymous', 
            'Fort Nelson Natural Resource', 'anonymous@test.com', null, 'CONSIDERED', 'This comment will be dealt with later', 'testdata')
        ;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM app_fom.public_comment where public_comment_id in (10,11);
        DELETE FROM app_fom.project where project_id in (1, 2);
        `);
    }

}
