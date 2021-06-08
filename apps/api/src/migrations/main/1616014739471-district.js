const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class district1616014739471 {

    async up(queryRunner) {
        await queryRunner.query(`
        INSERT INTO app_fom.district(district_id, name, email, create_user) VALUES 
        (43, 'Campbell River', 'Forests.CampbellRiverDistrictOffice', CURRENT_USER),
        (56, '100 Mile House', 'FLNR.100MileHouseDistrict', CURRENT_USER),
        (1826, 'Cariboo-Chilcotin', 'FLNR.AdminServicesCariboo', CURRENT_USER),
        (1828, 'Cascades', 'Forests.CascadesDistrictOffice', CURRENT_USER),
        (15, 'Chilliwack', 'Forests.ChilliwackDistrictOffice', CURRENT_USER),
        (32, 'Coast Mountains', 'Forests.KalumDistrictOffice', CURRENT_USER),
        (46, 'Fort Nelson', 'Forests.FortNelsonDistrictOffice', CURRENT_USER),
        (48, 'Haida Gwaii', 'FrontCounterHaidaGwaii', CURRENT_USER),
        (38, 'Mackenzie', 'Forests.MackenzieDistrictOffice', CURRENT_USER),
        (1823, 'Nadina', 'Forests.NadinaDistrictOffice', CURRENT_USER),
        (1832, 'North Island - Central Coast', 'Forests.NorthIslandCentralCoastDistrictOffice', CURRENT_USER),
        (1829, 'Okanagan Shuswap', 'Forests.OkanaganShuswapDistrictOffice', CURRENT_USER),
        (1825, 'Peace', 'Forests.PeaceDistrictOffice', CURRENT_USER),
        (18, 'Prince George', 'Forests.PrinceGeorgeDistrictOffice', CURRENT_USER),
        (50, 'Quesnel', 'Forests.QuesnelDistrictOffice', CURRENT_USER),
        (1831, 'Rocky Mountain', 'FCBC.CBK', CURRENT_USER),
        (23, 'Sea to Sky', 'FLNRO.SeatoSkyDistrict', CURRENT_USER),
        (1902, 'Selkirk', 'Resources.Nelson', CURRENT_USER),
        (1824, 'Skeena Stikine', 'Forests.SkeenaStikineDistrictOffice', CURRENT_USER),
        (1619, 'South Island', 'Forests.SouthIslandDistrictOffice', CURRENT_USER),
        (30, 'Stuart Nechako', 'Forests.VanderhoofDistrictOffice', CURRENT_USER),
        (27, 'Sunshine Coast', 'Forests.SunshineCoastDistrictOffice', CURRENT_USER),
        (21, 'Thompson Rivers', 'ThompsonRiversDistrict', CURRENT_USER)
        ;
        
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
        DELETE FROM app_fom.district;
        `);
    }

}
