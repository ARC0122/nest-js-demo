import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Hotel } from './hotel.entity';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  OwnerID: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  // Relations
  @OneToOne(() => User, (user) => user.owner, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'UserID' })
  user: User;

  @OneToMany(() => Hotel, (hotel) => hotel.owner, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  hotels: Hotel[];
}
