import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create a project', () => {
    it('should create', async () => {
      const requestData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 1,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };

      const projects = await request(app.getHttpServer())
      .get('/project');

      const res = await request(app.getHttpServer())
      .post('/project')
      .send(requestData);
      expect(res.status).toBe(201);
    });
  });
});
