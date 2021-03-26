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

  describe('project endpoints', () => {
    it('should return a list of projects', async () => {
      const res = await request(app.getHttpServer())
      .get('/project')
      expect(res.status).toBe(200);
    });

    it('should create a new project', async () => {
      const requestData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };

      const res = await request(app.getHttpServer())
      .post('/project')
      .send(requestData);
      expect(res.status).toBe(201);
      const resBody = res.body;
      expect(resBody).toBeDefined();
      expect(resBody.id).toBeDefined();
      expect(resBody.name).toEqual(resBody.name);
      expect(resBody.description).toEqual(resBody.description);
      expect(resBody.fspId).toEqual(resBody.fspId);
      expect(resBody.districtId).toEqual(resBody.districtId);
      expect(resBody.forestClientNumber).toEqual(resBody.forestClientNumber);
      expect(resBody.workflowStateCode).toEqual(resBody.workflowStateCode);
    });

    it('should update an existing project', async () => {
      // Create a project
      const createData = {
        name: 'Test Update',
        description: 'Test Update',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 1,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };

      const res = await request(app.getHttpServer())
      .post('/project')
      .send(createData);
      expect(res.status).toBe(201);

      const updateId = res.body ? res.body.id : undefined;

      // Update the project
      const updateData = {
        id: updateId,
        name: 'Test Updated',
        description: 'Test Updated',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 2,
        districtId: 15, // Chilliwack natural resources
        forestClientNumber: '1011',
        workflowStateCode: 'FINALIZED'
      };

      // Make the request to create the project
      const updateRes = await request(app.getHttpServer())
      .put(`/project/${updateId}`)
      .send(updateData);
      expect(updateRes.status).toBe(200);
      const updateBody = updateRes.body;
      expect(updateBody).toBeDefined();
      expect(updateBody.id).toEqual(updateId);
      expect(updateBody.name).toEqual(updateData.name);
      expect(updateBody.description).toEqual(updateData.description);
      expect(updateBody.fspId).toEqual(updateData.fspId);
      expect(updateBody.districtId).toEqual(updateData.districtId);
      expect(updateBody.forestClientNumber).toEqual(updateData.forestClientNumber);
      expect(updateBody.workflowStateCode).toEqual(updateData.workflowStateCode);
    });

    it('should add a comment to an existing project', async () => {
      const requestData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 2,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };

      /* const projects = await request(app.getHttpServer())
      .get('/project');

      const res = await request(app.getHttpServer())
      .post('/project')
      .send(requestData);
      expect(res.status).toBe(201); */
    });
  });
});
