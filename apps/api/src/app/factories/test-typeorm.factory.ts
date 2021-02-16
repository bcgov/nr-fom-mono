import { TypeOrmModule } from '@nestjs/typeorm';

function testTypeOrmModule() {
  return TypeOrmModule.forRoot({
    synchronize: false,
    autoLoadEntities: true,

    type: 'mongodb',
    url: 'mongodb://localhost:27017/',
    host: 'localhost',
    port: 27017,
    database: 'test',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    ssl: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    logging: true,
  });
}

export const testTypeOrmFactory = [testTypeOrmModule()];
