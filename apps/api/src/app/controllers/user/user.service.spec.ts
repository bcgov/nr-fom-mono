/* import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PinoLogger } from 'nestjs-pino';

import { getRepository, Repository } from 'typeorm';
import { userPropsFactory } from '../../factories/user.factory';
import { mockLoggerFactory } from '../../factories/mock-logger.factory';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          synchronize: false,
          autoLoadEntities: true,
          type: 'mongodb',
          url: 'mongodb://localhost:27017/',
          host: 'localhost',
          port: 27017,
          database: 'test',
          entities: [User],
          ssl: false,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          logging: true,
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        { provide: PinoLogger, useValue: mockLoggerFactory() },
        // UserService,
      ],
    }).compile();

    repository = getRepository(User);
    await repository.deleteMany({});

    const logger = module.get(PinoLogger);
    service = new UserService(repository, logger);
  });
  afterEach(async () => {
    await repository.deleteMany({});
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user ', async () => {
      const objectToTest = userPropsFactory();
      const expected = new User(objectToTest);
      const received = await service.create(objectToTest);

      expect(received.username).toEqual(expected.username);
      expect(received).toHaveProperty('_id');
    });
  });

  describe('findaAll', () => {
    it('should return many users', async () => {
      await service.create(userPropsFactory());
      await service.create(userPropsFactory());

      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });
  describe('findOne', () => {
    it('should return an existing user', async () => {
      const user = await service.create(userPropsFactory());

      const result = await service.findOne(user._id.toHexString());
      expect(result).toHaveProperty('username');
    });
  });

  describe('checkIfUserExists', () => {
    it('should have a user with the same username', async () => {
      const expected = await service.create(userPropsFactory());
      const result = await service.checkIfUserExists(expected.username);
      expect(result).toBeDefined();

      expect(result.username).toBe(expected.username);
    });
    it('should throw if the user does not exist', async () => {
      const email = 'fake@example.com';
      const spy = jest.fn(service.checkIfUserExists);
      const result = await service.checkIfUserExists(email);
      expect(spy).toThrowError();
    });
  });
}); */
