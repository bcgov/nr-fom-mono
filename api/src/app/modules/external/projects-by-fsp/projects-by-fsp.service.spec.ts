import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProjectByFspResponse } from "@src/app/modules/external/projects-by-fsp/projects-by-fsp.dto";
import { ProjectsByFspService } from "@src/app/modules/external/projects-by-fsp/projects-by-fsp.service";
import { ForestClientService } from "@src/app/modules/forest-client/forest-client.service";
import { ProjectResponse } from "@src/app/modules/project/project.dto";
import { Project } from "@src/app/modules/project/project.entity";
import { PinoLogger } from "nestjs-pino";
import { DataSource, Repository } from "typeorm";

describe('ProjectsByFspService', () => {
  let service: ProjectsByFspService;
  let forestClientService: ForestClientService;
  let repository: Repository<Project>;
  let createQueryBuilderMock: any;

  // service and dependencies setup.
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: provideDependencyMock()
    }).compile();

    forestClientService = moduleRef.get<ForestClientService>(ForestClientService);
    service = moduleRef.get<ProjectsByFspService>(ProjectsByFspService);
    repository = moduleRef.get(getRepositoryToken(Project));

    createQueryBuilderMock = {
      leftJoinAndSelect: () => createQueryBuilderMock,
      where: () => createQueryBuilderMock,
      andWhere: () => createQueryBuilderMock,
      orWhere: () => createQueryBuilderMock,
      addOrderBy: () => createQueryBuilderMock,
      limit: () => createQueryBuilderMock,
      getMany: () => [], // default empty
    };

  });

  // This is prerequisite to make sure services/repository are setup for testing.
  it('Services/repository for testing should be defined', () => {
    expect(service).toBeDefined();
    expect(forestClientService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findByFspId', () => {
    it('returns empty array when no fspId param', async () => {
      expect(await service.findByFspId(null)).toEqual([]);
    });

    it('returns empty array when query builder result is empty.', async () => {
      // use default createQueryBuilderMock
      const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock);
      const fspIdWithNoFom = 999;
      expect(await service.findByFspId(fspIdWithNoFom)).toEqual([]);
      expect(createQueryBuilderSpy).toHaveBeenCalled();
    });

    it('returns correct result when query builder finds records.', async () => {
      const foundProjects = getSimpleProjectResponseData();
      createQueryBuilderMock.getMany = jest.fn().mockReturnValue(foundProjects);
      const createQueryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder').mockImplementation(() => createQueryBuilderMock);
      const forestClientServiceConvertEntitySpy = jest.spyOn(forestClientService, 'convertEntity');
      const fspIdWithNoFom = 11;
      const result = await service.findByFspId(fspIdWithNoFom);
      expect(result.length).toEqual(getSimpleProjectResponseData().length);
      expect(result[0]).toBeInstanceOf(ProjectByFspResponse)
      expect(createQueryBuilderSpy).toHaveBeenCalled();
      expect(forestClientServiceConvertEntitySpy).toHaveBeenCalled();
      expect(result[0].fspId).toEqual(foundProjects[0].fspId)
    });
  });

});

export class ProjectRepositoryFake {
  public createQueryBuilder(): void {
    // This is intentional for empty body.
  }
}

function provideDependencyMock(): Array<any> {
  const dependencyMock =  
    [ ProjectsByFspService,
      {
        provide: getRepositoryToken(Project),
        useClass: ProjectRepositoryFake
      },
      {
        provide: PinoLogger,
        useValue: {
          info: jest.fn((x) => x),
          debug: jest.fn((x) => x),
          setContext: jest.fn((x) => x),
        }
      },
      {
        provide: ForestClientService,
        useValue: {
          convertEntity: jest.fn()
        }
      },
      {
        provide: DataSource,
        useValue: {
            getRepository: jest.fn()
        }
      }
    ];
  return dependencyMock;
}

function getSimpleProjectResponseData(): Partial<ProjectResponse>[] {
  const data = [
    {
      "id": 1,
      "name": "Project #1",
      "fspId": 11,
      "forestClient": {
        "id": "00001012",
        "name": "CLIENT #1"
      }
    },
    {
      "id": 2,
      "name": "Project #2",
      "fspId": 11,
      "forestClient": {
        "id": "00001015",
        "name": "CLIENT #2"
      }
    }
  ]
  return data;
}
