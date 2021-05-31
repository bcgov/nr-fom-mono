const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class district1616014739471 {

    async up(queryRunner) {
        await queryRunner.query(`
        INSERT INTO app_fom.district(district_id, name, email, create_user) VALUES 
        (43, 'Campbell River Natural Resource District', 'Forests.CampbellRiverDistrictOffice', CURRENT_USER),
        (56, '100 Mile House Natural Resource District', 'FLNR.100MileHouseDistrict', CURRENT_USER),
        (1826, 'Cariboo-Chilcotin Natural Resource District', 'FLNR.AdminServicesCariboo', CURRENT_USER),
        (1828, 'Cascades Natural Resource District', 'Forests.CascadesDistrictOffice', CURRENT_USER),
        (15, 'Chilliwack Natural Resource District', 'Forests.ChilliwackDistrictOffice', CURRENT_USER),
        (32, 'Coast Mountains Natural Resource District', 'Forests.KalumDistrictOffice', CURRENT_USER),
        (46, 'Fort Nelson Natural Resource District', 'Forests.FortNelsonDistrictOffice', CURRENT_USER),
        (48, 'Haida Gwaii Natural Resource District', 'FrontCounterHaidaGwaii', CURRENT_USER),
        (38, 'Mackenzie Natural Resource District', 'Forests.MackenzieDistrictOffice', CURRENT_USER),
        (1823, 'Nadina Natural Resource District', 'Forests.NadinaDistrictOffice', CURRENT_USER),
        (1832, 'North Island - Central Coast Natural Resource District', 'Forests.NorthIslandCentralCoastDistrictOffice', CURRENT_USER),
        (1829, 'Okanagan Shuswap Natural Resource District', 'Forests.OkanaganShuswapDistrictOffice', CURRENT_USER),
        (1825, 'Peace Natural Resource District', 'Forests.PeaceDistrictOffice', CURRENT_USER),
        (18, 'Prince George Natural Resource District', 'Forests.PrinceGeorgeDistrictOffice', CURRENT_USER),
        (50, 'Quesnel Natural Resource District', 'Forests.QuesnelDistrictOffice', CURRENT_USER),
        (1831, 'Rocky Mountain Natural Resource District', 'FCBC.CBK', CURRENT_USER),
        (23, 'Sea to Sky Natural Resource District', 'FLNRO.SeatoSkyDistrict', CURRENT_USER),
        (1902, 'Selkirk Natural Resource District', 'Resources.Nelson', CURRENT_USER),
        (1824, 'Skeena Stikine Natural Resource District', 'Forests.SkeenaStikineDistrictOffice', CURRENT_USER),
        (1619, 'South Island Natural Resource District', 'Forests.SouthIslandDistrictOffice', CURRENT_USER),
        (30, 'Stuart Nechako Natural Resource District', 'Forests.VanderhoofDistrictOffice', CURRENT_USER),
        (27, 'Sunshine Coast Natural Resource District', 'Forests.SunshineCoastDistrictOffice', CURRENT_USER),
        (21, 'Thompson Rivers Natural Resource District', 'ThompsonRiversDistrict', CURRENT_USER)
        ;
        
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
        DELETE FROM app_fom.district;
        `);
    }

}
