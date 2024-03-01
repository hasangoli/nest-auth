import { PermissionType } from 'src/iam/authorization/permission.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // @Column({ enum: Role, default: Role.Regular })
  // role: Role;

  @Column({ enum: Permissions, default: [], type: 'json' })
  permissions: (typeof PermissionType)[];
}
