import {
  Permission,
  PermissionType,
} from 'src/iam/authorization/permission.type';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiKey } from '../api-keys/entities/api-key.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  @Column({ default: false })
  isTfaEnabled: boolean;

  @Column({ nullable: true })
  tfaSecret: string;

  @Column({ enum: Permission, default: [], type: 'json' })
  permissions: PermissionType[];

  @ManyToMany((type) => ApiKey, (ApiKey) => ApiKey.user)
  apiKeys: ApiKey[];
}
