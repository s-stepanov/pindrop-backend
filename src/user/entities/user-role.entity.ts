import { Entity, PrimaryColumn } from 'typeorm';
import { UserRoles } from '../enums/user-roles.enum';

@Entity({
  name: 'user_roles',
})
export class UserRole {
  @PrimaryColumn()
  name: UserRoles;
}
