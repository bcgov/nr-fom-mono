export class BaseDto {
  public id: number;
  // Metadata fields
  public revisionCount: number;
  public createTimestamp: string;
  public createUser: string;
  public updateTimestamp: string;
  public updateUser: string
}
