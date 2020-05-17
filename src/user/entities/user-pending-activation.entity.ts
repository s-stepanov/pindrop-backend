import { Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'user_pending_activations',
})
export class UserPendingActivation {
  @PrimaryColumn()
  activationHash: string;

  @OneToOne(_ => User, { eager: true })
  @JoinColumn()
  user: User;
}
