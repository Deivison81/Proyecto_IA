import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Entity('ticket_updates')
export class TicketUpdateEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'ticket_id', type: 'uuid' })
  ticketId!: string;

  @ManyToOne(() => TicketEntity, (ticket) => ticket.updates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ticket_id' })
  ticket!: TicketEntity;

  @Column({ name: 'author_name', type: 'varchar', length: 140 })
  authorName!: string;

  @Column({ type: 'text' })
  note!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}
