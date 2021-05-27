import { mockLoggerFactory } from '../../factories/mock-logger.factory';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { User } from 'apps/api/src/core/security/user';
import { WorkflowStateCode, WorkflowStateEnum } from './workflow-state-code.entity';
import { ProjectUpdateRequest } from './project.dto';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    service = new ProjectService(null, mockLoggerFactory(), null, null);
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

    it ('public user cannot update', () => {
      expect(service.isUpdateAuthorized(request, entity, null)).toBe(false);
    });
    it ('ministry user can update when commenting open', () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_OPEN;
      expect(service.isUpdateAuthorized(request, entity, user)).toBe(true);
    });
    it ('ministry user cannot update when commenting closed', () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_CLOSED;
      expect(service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('forestry user for same client can update', () => {
      entity.workflowStateCode = WorkflowStateEnum.INITIAL;
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      expect(service.isUpdateAuthorized(request, entity, user)).toBe(true);
    });
    it ('forestry user for different client cannot update', () => {
      entity.workflowStateCode = WorkflowStateEnum.INITIAL;
      user.isForestClient = true;
      entity.forestClientId = TEST_CLIENT_ID;
      expect(service.isUpdateAuthorized(request, entity, user)).toBe(false);
    });
    it ('forestry user cannot update when finalized', () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = WorkflowStateEnum.FINALIZED;
      expect(service.isUpdateAuthorized(request, entity, user)).toBe(false);
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

    it ('public user can view', () => {
      expect(service.isViewAuthorized(entity, null)).toBe(true);
    });
    it ('ministry user can view', () => {
      user.isMinistry = true;
      expect(service.isViewAuthorized(entity, user)).toBe(true);
    });
    it ('forestry user for different client cannot view', () => {
      user.isForestClient = true;
      entity.forestClientId = TEST_CLIENT_ID;
      expect(service.isViewAuthorized(entity, user)).toBe(false);
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

    it ('public user can not delete', () => {
      expect(service.isDeleteAuthorized(entity, null)).toBe(false);
    });

    it ('forest client user can delete when client matches and state initial', () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = "INITIAL";
      expect(service.isDeleteAuthorized(entity, user)).toBe(true);
    });

    it ('forest client user can not delete when state published', () => {
      user.isForestClient = true;
      user.clientIds.push(TEST_CLIENT_ID);
      entity.forestClientId = TEST_CLIENT_ID;
      entity.workflowStateCode = WorkflowStateEnum.PUBLISHED;
      expect(service.isDeleteAuthorized(entity, user)).toBe(false);
    });

    it ('ministry user can not delete when state commenting open', () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_OPEN;
      expect(service.isDeleteAuthorized(entity, user)).toBe(false);
    });

    it ('ministry user can delete when state commenting closed', () => {
      user.isMinistry = true;
      entity.workflowStateCode = WorkflowStateEnum.COMMENT_CLOSED;
      expect(service.isDeleteAuthorized(entity, user)).toBe(true);
    });

  });

/*  
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
*/
/*
  describe('create', () => {
    it('should create a new project ', async () => {
      const objectToTest = projectPropsFactory();
      const expected = new Project(objectToTest);
      const received = await service.create<Project>(objectToTest);

      expect(received.name).toEqual(expected.name);
      expect(received).toHaveProperty('_id');
    });
  });

  describe('findAll', () => {
    it('should return many projects', async () => {
      await service.create<Project>(projectPropsFactory());
      await service.create<Project>(projectPropsFactory());

      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });
  describe('findOne', () => {
    it('should return an existing project', async () => {
      const project = await service.create<Project>(projectPropsFactory());

      const result = await service.findOne<Project>(project.id);
      expect(result).toHaveProperty('name');
    });
  });
*/
});
