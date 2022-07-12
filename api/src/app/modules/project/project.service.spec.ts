import { User } from "@utility/security/user";
import { mockLoggerFactory } from '../../factories/mock-logger.factory';
import { ProjectCreateRequest, ProjectUpdateRequest } from './project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { WorkflowStateEnum } from './workflow-state-code.entity';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    service = new ProjectService(null, mockLoggerFactory(), null, null, null, null, null);
  });

  describe('isCreateAuthorized', () => {
    let request: ProjectCreateRequest;
    let user: User;
    const TEST_CLIENT_ID: string = '1011';

    beforeEach(async () => {
      user = new User();
      request = new ProjectCreateRequest();
      request.forestClientNumber = TEST_CLIENT_ID;
    })

    it ('public user cannot create', async () => {
      expect(await service.isCreateAuthorized(request, null)).toBe(false);
    });

    it ('forest client user with matching forest client can create', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      expect(await service.isCreateAuthorized(request, user)).toBe(true);
    });
    
    it ('request forest client undefined cannot create', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      delete request.forestClientNumber;
      expect(await service.isCreateAuthorized(request, user)).toBe(false);
    });
    
  });

  describe('isUpdateAuthorized', () => {
    let entity: Project;
    let request: ProjectUpdateRequest;
    let user: User;
    const TEST_CLIENT_ID = '1011';

    beforeEach(async () => {
      entity = new Project();
      user = new User();
      request = new ProjectUpdateRequest();
    })

    it ('public user cannot update', async () => {
      expect(await service.isUpdateAuthorized(request, entity, null)).toBe(false);
    });
    it ('ministry user cannot update when commenting open', async () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_OPEN;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('ministry user cannot update when commenting closed', async () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_CLOSED;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('forestry user for same client can update', async () => {
      entity.workflowStateCode = WorkflowStateEnum.INITIAL;
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(true);
    });
    it ('forestry user for different client cannot update', async () => {
      entity.workflowStateCode = WorkflowStateEnum.INITIAL;
      user.isForestClient = true;
      entity.forestClientId = TEST_CLIENT_ID;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('forestry user cannot update when finalized', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = WorkflowStateEnum.FINALIZED;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('forestry user cannot update when published', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = WorkflowStateEnum.PUBLISHED;
      expect(await service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });

  });


  describe('isViewAuthorized', () => {
    let entity:Project;
    let user:User;
    const TEST_CLIENT_ID = '1011';

    beforeEach(async () => {
      entity = new Project();
      user = new User();
    })

    it ('public user can view', async () => {
      expect(await service.isViewAuthorized(entity, null)).toBe(true);
    });
    it ('ministry user can view', async () => {
      user.isMinistry = true;
      expect(await service.isViewAuthorized(entity, user)).toBe(true);
    });
    it ('forestry user for different client cannot view', async () => {
      user.isForestClient = true;
      entity.forestClientId = TEST_CLIENT_ID;
      expect(await service.isViewAuthorized(entity, user)).toBe(false);
    });
  });

  describe('isDeleteAuthorized', () => {
    let entity:Project;
    let user:User;
    const TEST_CLIENT_ID = '1011';

    beforeEach(async () => {
      entity = new Project();
      user = new User();
    })

    it ('public user can not delete', async () => {
      expect(await service.isDeleteAuthorized(entity, null)).toBe(false);
    });

    it ('forest client user can delete when client matches and state initial', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = "INITIAL";
      expect(await service.isDeleteAuthorized(entity, user)).toBe(true);
    });

    it ('forest client user can not delete when state published', async () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = WorkflowStateEnum.PUBLISHED;
      expect(await service.isDeleteAuthorized(entity, user)).toBe(false);
    });

    it ('ministry user can not delete when state commenting open', async () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_OPEN;
      expect(await service.isDeleteAuthorized(entity, user)).toBe(false);
    });

    it ('ministry user can delete when state commenting closed', async () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_CLOSED;
      expect(await service.isDeleteAuthorized(entity, user)).toBe(true);
    });

  });

/*  Example of creating a mock module.
  let repository: Repository<Project>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Config
        AppConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [AppConfigModule],
          useFactory: (configService: AppConfigService) => {
            return {
              autoLoadEntities: true,
              type: configService.db('type'),
              name: configService.db('username'),
              password: configService.db('password'),
              database: configService.db('database'),
              schema: 'app_fom',
              host: configService.db('host'),
              entities: configService.db('entities'),
              synchronize: configService.db('synchronize'),
              ssl: configService.db('ssl'),
              useUnifiedTopology: true,
              useNewUrlParser: true,
            };
          },
          inject: [AppConfigService],
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(Project),
          useClass: Repository,
        },
        { provide: PinoLogger, useValue: mockLoggerFactory() },
        // ProjectService,
      ],
    }).compile();

    repository = getRepository(Project);

    const logger = module.get(PinoLogger);
    service = new ProjectService(repository, logger, new DistrictService(null, logger), new ForestClientService(null, logger));
  });

*/
});
