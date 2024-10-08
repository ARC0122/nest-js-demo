import { Owner } from 'src/owners/entities/owner.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  HotelID: number;

  @Column()
  hotelName: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: false })
  OwnerID: number;

  // Relations
  @ManyToOne(() => Owner, (owner) => owner.hotels, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'OwnerID' })
  owner: Owner;
}
