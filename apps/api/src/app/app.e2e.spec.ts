import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';

// Test helper functions - don't forget to curry in the app!
const createProjectAndVerifyResultFunction = (app) => async (createData) => {
  const res = await request(app.getHttpServer())
  .post('/project')
  .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody).toBeDefined();
  expect(resBody.id).toBeDefined();
  expect(resBody.name).toEqual(createData.name);
  expect(resBody.description).toEqual(createData.description);
  expect(resBody.fspId).toEqual(createData.fspId);
  expect(resBody.districtId).toEqual(createData.districtId);
  expect(resBody.forestClientNumber).toEqual(createData.forestClientNumber);
  expect(resBody.workflowStateCode).toEqual(createData.workflowStateCode);

  return res;
}

const updateProjectAndVerifyResultFunction = (app) => async (updateId, updateData) => {
  const res = await request(app.getHttpServer())
  .put(`/project/${updateId}`)
  .send(updateData);
  expect(res.status).toBe(200);

  // Test body
  const resBody = res.body;
  expect(resBody).toBeDefined();
  expect(resBody.id).toBeDefined();
  expect(resBody.name).toEqual(updateData.name);
  expect(resBody.description).toEqual(updateData.description);
  expect(resBody.fspId).toEqual(updateData.fspId);
  expect(resBody.districtId).toEqual(updateData.districtId);
  expect(resBody.forestClientNumber).toEqual(updateData.forestClientNumber);
  expect(resBody.workflowStateCode).toEqual(updateData.workflowStateCode);

  return res;
}

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;
  // Declare vars to hold helper functions
  // We'll need to curry in app each one
  let createProjectAndVerifyResult;
  let updateProjectAndVerifyResult;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    createProjectAndVerifyResult = createProjectAndVerifyResultFunction(app);
    updateProjectAndVerifyResult = updateProjectAndVerifyResultFunction(app);
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
      // Create a project
      const createData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };
      await createProjectAndVerifyResult(createData);
    });

    it('should update an existing project', async () => {
      // Create a project
      const createData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL'
      };
      const res = await createProjectAndVerifyResult(createData);
      const resBody = res.body;

      const updateId = resBody ? resBody.id : undefined;

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

      // Make the request to update the project
      await updateProjectAndVerifyResult(updateId, updateData);
    });

    it('should add a comment to an existing project', async () => {
      // Create a project
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
      const res = await createProjectAndVerifyResult(requestData);
      const resBody = res.body;

      const updateId = resBody ? resBody.id : undefined;

      // Attach a comment
      // First create the comment
    });
  });
});
