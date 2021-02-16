import { Column, Entity } from 'typeorm';

@Entity('keyPair')
export class KeyPair<T> {
  @Column() key: string;
  @Column() value: T;
}
