import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IsOptional } from 'class-validator';
import { Owner } from 'src/owners/entities/owner.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  UserID: number;

  @Column()
  FName: string;

  @Column()
  LName: string;

  @Column({ unique: true })
  Email: string;

  @Column()
  Mobile: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
  })
  Gender: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  @IsOptional()
  createdBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  @IsOptional()
  updatedBy: number;

  // Relations
  @OneToOne(() => Owner, (owner) => owner.user, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'UserID' })
  owner: Owner;
}
