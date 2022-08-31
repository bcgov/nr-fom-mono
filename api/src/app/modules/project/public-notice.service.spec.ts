import { ProjectService } from "@api-modules/project/project.service";
import { PublicNotice } from "@api-modules/project/public-notice.entity";
import { PublicNoticeService } from "@api-modules/project/public-notice.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "@utility/security/user";
import { PinoLogger } from "nestjs-pino/dist/PinoLogger";
import { ProjectResponse } from "./project.dto";
import { PublicNoticeCreateRequest, PublicNoticePublicFrontEndResponse } from "./public-notice.dto";
import { WorkflowStateEnum } from "./workflow-state-code.entity";

describe('PublicNoticeService', () => {
    let service: PublicNoticeService;
    let projectService: ProjectService;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
          providers: provideDependencyMock()
        }).compile();

        projectService = moduleRef.get<ProjectService>(ProjectService);
        service = moduleRef.get<PublicNoticeService>(PublicNoticeService);
    });

    // This is prerequisite to make sure service is setup for testing.
    it('Service for testing should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('isCreateAuthorized', () => {
      let request: PublicNoticeCreateRequest;
      let user: User;

      beforeEach(async () => {
        user = new User();
        request = new PublicNoticeCreateRequest();
      })

      it('public user cannot create', async () => {
        expect(await service.isCreateAuthorized(request, null)).toBe(false);
      });
      
      it('project contains public notice, cannot create', async () => {
        const projectResponseData: any = getSimpleProjectResponseData();
        request.projectId = (projectResponseData as ProjectResponse).id;
        const projectServiceMock = jest.spyOn(projectService, 'findOne').mockResolvedValue(projectResponseData);

        const testResult = await service.isCreateAuthorized(request, user);

        expect(testResult).toBeFalsy();
        expect(projectServiceMock).toHaveBeenCalledWith(request.projectId, user);
      });

      it.each([
        WorkflowStateEnum.PUBLISHED, 
        WorkflowStateEnum.COMMENT_OPEN, 
        WorkflowStateEnum.COMMENT_CLOSED, 
        WorkflowStateEnum.FINALIZED, 
        WorkflowStateEnum.EXPIRED])
      ('cannot create public notice for project status other than "INITIAL"', 
      async (testWorkflowStateCode) => {
        const projectResponseData: ProjectResponse = getSimpleProjectResponseData();
        projectResponseData.id = 2;
        projectResponseData.publicNoticeId = undefined; // no public_notice exists for projectId = 2, so can be created;
        projectResponseData.workflowState.code = testWorkflowStateCode; // can't create with this status.
        const projectServiceMock = jest.spyOn(projectService, 'findOne').mockResolvedValue(projectResponseData);
        request.projectId = projectResponseData.id;

        const testResult = await service.isCreateAuthorized(request, user);

        expect(projectResponseData.workflowState.code).toBe(testWorkflowStateCode);
        expect(testResult).toBeFalsy();
        expect(projectServiceMock).toHaveBeenCalledWith(request.projectId, user);
      });

      it('cannot create public notice for project status "INITIAL" with wrong forest-client', 
      async () => {
        const projectResponseData: ProjectResponse = getSimpleProjectResponseData();
        projectResponseData.id = 2;
        projectResponseData.publicNoticeId = undefined; // no public_notice exists for projectId = 2, so can be created;
        projectResponseData.workflowState.code = WorkflowStateEnum.INITIAL; // can create with this status.
        const wrongForestClientId = 'wrong-id';
        projectResponseData.forestClient.id = wrongForestClientId;
        const projectServiceMock = jest.spyOn(projectService, 'findOne').mockResolvedValue(projectResponseData);
        user.isForestClient = true;
        const userMock = jest.spyOn((user as any), 'isAuthorizedForClientId').mockReturnValue(false); // this client is not authorized.
        request.projectId = projectResponseData.id;

        const testResult = await service.isCreateAuthorized(request, user);

        expect(testResult).toBeFalsy();
        expect(projectServiceMock).toHaveBeenCalledWith(request.projectId, user);
        expect(userMock).toHaveBeenCalledWith(wrongForestClientId);
      });

      it('can create public notice for project status "INITIAL" with right forest-client', 
      async () => {
        const projectResponseData: ProjectResponse = getSimpleProjectResponseData();
        projectResponseData.id = 2;
        projectResponseData.publicNoticeId = undefined; // no public_notice exists for projectId = 2, so can be created;
        projectResponseData.workflowState.code = WorkflowStateEnum.INITIAL; // can create with this status.
        const projectServiceMock = jest.spyOn(projectService, 'findOne').mockResolvedValue(projectResponseData);
        user.isForestClient = true;
        const userMock = jest.spyOn((user as any), 'isAuthorizedForClientId').mockReturnValue(true);
        request.projectId = projectResponseData.id;

        const testResult = await service.isCreateAuthorized(request, user);

        expect(testResult).toBeTruthy();
        expect(projectServiceMock).toHaveBeenCalledWith(request.projectId, user);
        expect(userMock).toHaveBeenCalledWith(projectResponseData.forestClient.id);
      });

    });

    describe('findForPublicFrontEnd', () => {

      it("Return cache Public Notices when cache still presents", async () => {
        const cacheResult: Array<PublicNoticePublicFrontEndResponse> = getSimplePublicNoticePublicFrontEndResponseData();
        const cacheMock = jest.spyOn((service as any).cache, 'get').mockImplementation(jest.fn((x) => cacheResult));

        const testResult = await service.findForPublicFrontEnd();

        expect(testResult).toBe(cacheResult);
        expect(cacheMock).toHaveBeenCalledWith(service.cacheKey);
      });

    });

});

function provideDependencyMock(): Array<any> {
  const dependencyMock =  
    [ PublicNoticeService,
      {
        provide: getRepositoryToken(PublicNotice),
        useValue: {
            createQueryBuilder: jest.fn(),
        }
      },
      {
        provide: PinoLogger,
        useValue: {
          info: jest.fn((x) => x),
          setContext: jest.fn((x) => x),
        }
      },
      {
        provide: ProjectService,
        useValue: {
          findOne: jest.fn(),
          convertEntity: jest.fn()
        }
      }
    ];
  return dependencyMock;
}

function getSimplePublicNoticeCreateRequestData() {
  const data = {
    "projectId": 1,
    "reviewAddress": "#1 some review address",
    "reviewBusinessHours": "1 to 5 pm Friday",
    "receiveCommentsAddress": "#1 some receive comment address",
    "receiveCommentsBusinessHours": "9 to 12 am Monday to Friday",
    "isReceiveCommentsSameAsReview": true,
    "mailingAddress": "#1 some mailing address",
    "email": "a1@test.com",
    "operationStartYear": 2028,
    "operationEndYear": 2031
  };
  return data;
}

function getSimpleProjectResponseData() {
  const data =  
  {
    "id": 1,
    "name": "Project #1",
    "description": "Project #1",
    "commentingOpenDate": "2022-08-01",
    "commentingClosedDate": "2027-07-29",
    "validityEndDate": "2052-12-31",
    "fspId": 10,
    "district": {
      "id": 21,
      "name": "Thompson Rivers"
    },
    "forestClient": {
      "id": "00001012",
      "name": "BELL LUMBER & POLE CANADA, ULC"
    },
    "workflowState": {
      "factory": null, // Temporarily added here, without this ts will have complaint. Probably due to type is an entity, not dto.
      "code": "COMMENT_OPEN",
      "description": "Commenting Open"
    },
    "revisionCount": 1,
    "createTimestamp": "2022-08-29 20:18:37.921048+00",
    "commentClassificationMandatory": false,
    "publicNoticeId": 10001
  }
  return data;
}

function getSimplePublicNoticePublicFrontEndResponseData() { 
  const data = [
    {
      ...getSimplePublicNoticeCreateRequestData(),
      "project": {...getSimpleProjectResponseData()}
    }
  ];
  return data;
}