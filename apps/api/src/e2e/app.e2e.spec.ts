import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { KeycloakConfig } from '../core/security/auth.service';
import { User } from '../core/security/user';
import { ProjectResponse } from '../app/modules/project/project.dto';
import { LoggerModule } from 'nestjs-pino';
import { createFakeMinistryUser, createFakeForestryUser } from '../core/security/mock-user.factory';

process.env.KEYCLOAK_ENABLED="false"; // Necessary in order for authentication to succeed.

const httpGetFunction = (app) => async ( user: User, args: string ) => {
  return await request(app.getHttpServer()).get(args).set('Authorization', 'Bearer ' + JSON.stringify(user) );
};

describe('API endpoints testing (e2e)', () => {
  let app: INestApplication;
  let httpGet;

  beforeAll(async () => {

    // Disable info logging to reduce noise during testing. Ideally set LOG_LEVEL environment variable to warn. (setting this above didn't work for unknown reason)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, LoggerModule.forRoot({
        pinoHttp: { level: 'warn' },
      })],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true}));

    await app.init();

    httpGet = httpGetFunction(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Endpoint', () => {
    // Testing of other endpoints is based on keycloak being disabled.
    it('should have keycloak disabled', async () => {
      const res = await request(app.getHttpServer()).get('/keycloakConfig');
      const config = res.body as KeycloakConfig;
      expect(config.enabled).toBe(false);
    });
  });

  describe('Project Endpoint', () => {
    it('get /project should return a list of projects', async () => {
      const user: User = createFakeMinistryUser();
      const res = await httpGet(user, '/project');
      expect(res.status).toBe(200);
      const result:ProjectResponse[] = res.body as ProjectResponse[];
      // Expect projects to be returned.
      expect(result.length).toBeGreaterThan(0);
    });

    describe('Forest-client Endpoint', () => {
      it('get /forest-client with non-existant id should return HTTP 400 bad request', async () => {
        const user: User = createFakeForestryUser();
        const res = await httpGet(user, '/forest-client/-1');
        expect(res.status).toBe(400);
      });
    });
  
  });
  
/*
  describe('project endpoints', () => {
    it('should return a list of projects', async () => {
      const res = await request(app.getHttpServer()).get('/projects');
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
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
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
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Update the project
      const updateData = {
        id: projectId,
        revisionCount: 1,
        name: 'Test Updated',
        description: 'Test Updated',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 2,
        districtId: 15, // Chilliwack natural resources
        forestClientNumber: '1011',
        workflowStateCode: 'FINALIZED',
      } as ProjectUpdateRequest;

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
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
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
        responseCode: 'CONSIDERED',
        commentScopeCode: 'OVERALL',
      } as PublicCommentCreateRequest;

      // Attach a comment
      // First create the comment
      await createCommentAndVerifyResult(commentData);
    });

    it('should return a list of comments for an existing project', async () => {
      // Create a project
      const createData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      const commentData1 = {
        feedback: 'Testing project comments #1',
        name: 'Bob Johnson',
        location: 'Some Location',
        email: 'bob.johnson@example.com',
        phoneNumber: '(555) 555-5555',
        responseDetails: 'Ipsum lorem dolor',
        projectId: projectId,
        responseCode: 'CONSIDERED',
        commentScopeCode: 'OVERALL',
      } as PublicCommentCreateRequest;

      // Attach a comment
      // First create the comment
      await createCommentAndVerifyResult(commentData1);

      const commentData2 = {
        feedback: 'Testing project comments #2',
        name: 'Bob Johnson',
        location: 'Some Location',
        email: 'bob.johnson@example.com',
        phoneNumber: '(555) 555-5555',
        responseDetails: 'Ipsum lorem dolor',
        projectId: projectId,
        responseCode: 'CONSIDERED',
        commentScopeCode: 'OVERALL',
      } as PublicCommentCreateRequest;

      // Attach a comment
      // First create the comment
      await createCommentAndVerifyResult(commentData2);

      const byProjectIdRes = await request(app.getHttpServer()).get(
        `/public-comments/byProjectId/${projectId}`
      );
      expect(byProjectIdRes.status).toBe(200);
      const byFspIdRecords = byProjectIdRes.body.length;
      expect(byFspIdRecords).toEqual(2);
    });

    it('should return a list of projects by fsp id', async () => {

      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 10,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      await createProjectAndVerifyResult(createProjectData);

      const byFspIdRes = await request(app.getHttpServer()).get(
        `/projects/byFspId/10`
      );
      expect(byFspIdRes.status).toBe(200);
      const byFspIdRecords = byFspIdRes.body.length;
      expect(byFspIdRecords).toEqual(1);
    });

    it('should return a list of submissions', async () => {
      const res = await request(app.getHttpServer()).post('/submissions');
      expect(res.status).toBe(201);
    });

    it('should create a new submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      await createSubmissionAndVerifyResult(createSubmissionData);
    });
    */
/*
    it('should create a cut block for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a cut block for an existing submission
      const createCutBlockData = {
        geometry: { type: 'Polygon', coordinates: [[[102.0, 0.5]]] },
        plannedDevelopmentDate: '2020-10-10',
        plannedAreaHa: 86,
        submissionId: submissionId,
      } as CutBlockDto;

      await createCutBlockAndVerifyResult(createCutBlockData);
    });

    it('should update a cut block for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a cut block for an existing submission
      const createCutBlockData = {
        geometry: { type: 'Polygon', coordinates: [[[102.0, 0.5]]] },
        plannedDevelopmentDate: '2020-10-10',
        plannedAreaHa: 86,
        submissionId: submissionId,
      } as CutBlockDto;

      await createCutBlockAndVerifyResult(createCutBlockData);
    });

    it('should create a retention area for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a retention area for an existing submission
      const createRetentionAreaData = {
        geometry: { type: 'Polygon', coordinates: [[[102.0, 0.5]]] },
        plannedAreaHa: 86,
        submissionId: submissionId,
      } as RetentionAreaDto;

      await createRetentionAreaAndVerifyResult(createRetentionAreaData);
    });

    it('should update a retention area for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a retention area for an existing submission
      const createRetentionAreaData = {
        geometry: { type: 'Polygon', coordinates: [[[102.0, 0.5]]] },
        plannedAreaHa: 86,
        submissionId: submissionId,
      } as RetentionAreaDto;

      await createRetentionAreaAndVerifyResult(createRetentionAreaData);
    });

    it('should create a road section for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a road section for an existing submission
      const createRoadSectionData = {
        geometry: {
          type: 'LineString',
          coordinates: [
            [
              [102.0, 0.5],
              [102.0, 0.5],
            ],
          ],
        },
        plannedDevelopmentDate: '2020-10-10',
        plannedLengthKm: 86,
        submissionId: submissionId,
      } as RoadSectionDto;

      await createRoadSectionAndVerifyResult(createRoadSectionData);
    });

    it('should update a road section for an existing submission', async () => {
      // Create a project
      const createProjectData = {
        name: 'Test',
        description: 'Test',
        commentingOpenDate: '2020-10-10',
        commentingClosedDate: '2020-10-10',
        fspId: 1,
        districtId: 15,
        forestClientNumber: '1011',
        workflowStateCode: 'INITIAL',
      } as ProjectCreateRequest;
      const res = await createProjectAndVerifyResult(createProjectData);
      const resBody = res.body;

      const projectId = resBody ? resBody.id : undefined;

      // Create a submission
      const createSubmissionData = {
        projectId: projectId,
        submissionTypeCode: 'PROPOSED',
      } as SubmissionRequest;

      const submissionRes = await createSubmissionAndVerifyResult(
        createSubmissionData
      );
      const submissionBody = submissionRes.body;

      const submissionId = submissionBody ? submissionBody.id : undefined;

      // Create a road section for an existing submission
      const createRoadSectionData = {
        geometry: {
          type: 'LineString',
          coordinates: [
            [
              [102.0, 0.5],
              [102.0, 0.5],
            ],
          ],
        },
        plannedDevelopmentDate: '2020-10-10',
        plannedLengthKm: 86,
        submissionId: submissionId,
      } as RoadSectionDto;

      await createRoadSectionAndVerifyResult(createRoadSectionData);
    });
    
  });
  */
});
/*
const verifyCreateMetadata = (data) => {
  expect(data.createTimestamp).not.toBeNull();
  expect(data.createUser).not.toBeNull();
  expect(data.updateTimestamp).toBeNull();
  expect(data.updateUser).toBeNull();
};

const verifyUpdateMetadata = (data) => {
  expect(data.createTimestamp).not.toBeNull();
  expect(data.createUser).not.toBeNull();
  expect(data.updateTimestamp).not.toBeNull();
  expect(data.updateUser).not.toBeNull();
};

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
  verifyCreateMetadata(resBody);

  return res;
};

const updateProjectAndVerifyResultFunction = (app) => async (
  projectId,
  updateData
) => {
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
  verifyUpdateMetadata(resBody);

  return res;
};

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
  verifyCreateMetadata(resBody);

  return res;
};

// Test helper functions - don't forget to curry in the app!
const createSubmissionAndVerifyResultFunction = (app) => async (createData) => {
  const res = await request(app.getHttpServer())
    .post('/submission')
    .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody).toBeDefined();
  expect(resBody.id).toBeDefined();
  expect(resBody.geometry).toEqual(createData.geometry);
  expect(resBody.projectId).toEqual(createData.projectId);
  expect(resBody.submissionTypeCode).toEqual(createData.submissionTypeCode);
  verifyCreateMetadata(resBody);

  return res;
};

const createCutBlockAndVerifyResultFunction = (app) => async (createData) => {
  const res = await request(app.getHttpServer())
    .post('/cut-block')
    .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody.id).toBeDefined();
  expect(resBody.geometry).toBeDefined();
  expect(resBody.plannedDevelopmentDate).toEqual(
    createData.plannedDevelopmentDate
  );
  expect(resBody.plannedAreaHa).toEqual(createData.plannedAreaHa);
  expect(resBody.submissionId).toEqual(createData.submissionId);
  verifyCreateMetadata(resBody);

  return res;
};

const createRetentionAreaAndVerifyResultFunction = (app) => async (
  createData
) => {
  const res = await request(app.getHttpServer())
    .post('/retention-area')
    .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody.id).toBeDefined();
  expect(resBody.geometry).toBeDefined();
  expect(resBody.plannedDevelopmentDate).toEqual(
    createData.plannedDevelopmentDate
  );
  expect(resBody.plannedAreaHa).toEqual(createData.plannedAreaHa);
  expect(resBody.submissionId).toEqual(createData.submissionId);
  verifyCreateMetadata(resBody);

  return res;
};

const createRoadSectionAndVerifyResultFunction = (app) => async (
  createData
) => {
  const res = await request(app.getHttpServer())
    .post('/road-section')
    .send(createData);
  expect(res.status).toBe(201);

  // Test body
  const resBody = res.body;
  expect(resBody.id).toBeDefined();
  expect(resBody.geometry).toBeDefined();
  expect(resBody.plannedDevelopmentDate).toEqual(
    createData.plannedDevelopmentDate
  );
  expect(resBody.plannedAreaHa).toEqual(createData.plannedAreaHa);
  expect(resBody.submissionId).toEqual(createData.submissionId);
  verifyCreateMetadata(resBody);

  return res;
};

*/