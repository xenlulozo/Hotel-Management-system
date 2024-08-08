import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'oauth_access_token'
})
export class OauthAccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: 0
  })
  user_id: number;

  @Column({
    type: 'int',
    default: 0
  })
  platform: number;

  @Column({
    type: 'text',
    default: ''
  })
  token: string;

  @Column({
    type: 'text',
    default: ''
  })
  refresh_token: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updated_at: Date;
}
