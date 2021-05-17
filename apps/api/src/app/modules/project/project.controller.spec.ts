import { Test, TestingModule } from '@nestjs/testing';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { mockDataServiceFactory } from '../../factories/mock-data-service.factory';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],

      providers: [
        {
          provide: ProjectService,
          useValue: mockDataServiceFactory(new Project()),
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
