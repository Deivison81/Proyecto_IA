import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { TicketPriority } from '../../../../domain/tickets/ticket-priority.type';
import type { TicketStatus } from '../../../../domain/tickets/ticket-status.type';
import { UserEntity } from './user.entity';
import { TicketUpdateEntity } from './ticket-update.entity';

@Entity('tickets')
export class TicketEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'varchar', length: 180 })
  service!: string;

  @Column({ type: 'varchar', length: 30 })
  priority!: TicketPriority;

  @Column({ type: 'varchar', length: 30 })
  status!: TicketStatus;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  evidence!: string | null;

  @Column({ type: 'text', nullable: true })
  diagnosis!: string | null;

  @Column({ name: 'requester_type', type: 'varchar', length: 20 })
  requesterType!: 'client' | 'internal';

  @Column({ name: 'client_name', type: 'varchar', length: 140 })
  clientName!: string;

  @Column({ name: 'created_by_user_id', type: 'uuid' })
  createdByUserId!: string;

  @Column({ name: 'assigned_to_user_id', type: 'uuid', nullable: true })
  assignedToUserId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser!: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigned_to_user_id' })
  assignedToUser!: UserEntity | null;

  @OneToMany(() => TicketUpdateEntity, (update) => update.ticket, {
    cascade: false,
  })
  updates!: TicketUpdateEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
