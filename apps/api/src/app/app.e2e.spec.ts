import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './app.module';
import {CreatePublicCommentDto} from './controllers/public-comment/dto/create-public-comment.dto';
import {CreateProjectDto} from './controllers/project/dto/create-project.dto';

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

const updateProjectAndVerifyResultFunction = (app) => async (projectId, updateData) => {
  const res = await request(app.getHttpServer())
  .put(`/project/${projectId}`)
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

const createCommentAndVerifyResultFunction = (app) => async (createData) => {
  const res = await request(app.getHttpServer())
  .post('/public-comment')
  .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody.id).toBeDefined();
  expect(resBody.feedback).toEqual(createData.feedback);
  expect(resBody.name).toEqual(createData.name);
  expect(resBody.location).toEqual(createData.location);
  expect(resBody.email).toEqual(createData.email);
  expect(resBody.phoneNumber).toEqual(createData.phoneNumber);
  expect(resBody.responseDetails).toEqual(createData.responseDetails);
  expect(resBody.projectId).toEqual(createData.projectId);
  expect(resBody.responseCode).toEqual(createData.responseCode);

  return res;
}

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;
  // Declare vars to hold helper functions
  // We'll need to curry in app each one
  let createProjectAndVerifyResult;
  let updateProjectAndVerifyResult;
  let createCommentAndVerifyResult;


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
    createCommentAndVerifyResult = createCommentAndVerifyResultFunction(app);
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
      } as CreateProjectDto;
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
      } as CreateProjectDto;
      const res = await createProjectAndVerifyResult(createData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Update the project
      const updateData = {
        id: projectId,
        name: 'Test Updated',
        description: 'Test Updated',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 2,
        districtId: 15, // Chilliwack natural resources
        forestClientNumber: '1011',
        workflowStateCode: 'FINALIZED'
      } as CreateProjectDto;

      // Make the request to update the project
      await updateProjectAndVerifyResult(projectId, updateData);
    });

    it('should add a comment to an existing project', async () => {
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
      } as CreateProjectDto;
      const res = await createProjectAndVerifyResult(createData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      const commentData = {
        feedback: 'Testing feedback',
        name: 'Bob Johnson',
        location: 'Some Location',
        email: 'bob.johnson@example.com',
        phoneNumber: '(555) 555-5555',
        responseDetails: 'Ipsum lorem dolor',
        projectId: projectId,
        responseCode: 'CONSIDERED'
      } as CreatePublicCommentDto;

      // Attach a comment
      // First create the comment
      await createCommentAndVerifyResult(commentData)
    });
  });
});
