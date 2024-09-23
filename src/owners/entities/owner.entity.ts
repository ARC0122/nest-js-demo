import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  OwnerID: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: false })
  UserID: number;

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
