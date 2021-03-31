import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { PinoLogger } from 'nestjs-pino';

import { getRepository, Repository } from 'typeorm';
import { projectPropsFactory } from '../../factories/project.factory';
import { mockLoggerFactory } from '../../factories/mock-logger.factory';
import { AppConfigModule } from '../../modules/app-config/app-config.module';
import { AppConfigService } from '../../modules/app-config/app-config.provider';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: Repository<Project>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Config
        AppConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [AppConfigModule],
          useFactory: (configService: AppConfigService) => {
            const config = {
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

            return config;
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
    // await repository.deleteMany({});

    const logger = module.get(PinoLogger);
    service = new ProjectService(repository, logger);
  });
  afterEach(async () => {
    // await repository.deleteMany({});
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

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

  describe('checkIfProjectExists', () => {
    it('should have a project with the same name', async () => {
      const expected = await service.create<Project>(projectPropsFactory());
      // @ts-ignore
      /* const result: { name: string } = await service.checkIfProjectExists(expected.name);
      expect(result).toBeDefined();

      expect(result.name).toBe(expected.name); */
    });
    it('should throw if the project does not exist', async () => {
      /* const email = 'fake@example.com';
      const spy = jest.fn(service.checkIfProjectExists);
      const result = await service.checkIfProjectExists(email);
      expect(spy).toThrowError(); */
    });
  });
});
