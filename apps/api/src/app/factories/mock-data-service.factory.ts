/* import { ApiBaseEntity, DeepPartial } from '@api';

class MockDataService<T extends ApiBaseEntity<T>> {
  mockDocuments = new Map<string, T>();

  updatedDocument: T;
  factory: (props: Partial<T>) => DeepPartial<T>;
  constructor(entity: T) {
    this.factory = entity.factory;
  }
  public create(dto: Partial<T>): DeepPartial<T> {
    return this.factory(dto);
  }

  public async remove(id: string): Promise<void> {
    this.mockDocuments.delete(id);
  }
  public async findOne(id: string): Promise<T> {
    return this.mockDocuments.get(id);
  }
  public async findAll(): Promise<T[]> {
    return Array.from(this.mockDocuments.values());
  }

  public async update(id: string, doc: Partial<T>): Promise<T> {
    return this.updatedDocument;
  }
}

export function mockDataServiceFactory<T extends ApiBaseEntity<T>>(entity: T) {
  return new MockDataService(entity);
} */
