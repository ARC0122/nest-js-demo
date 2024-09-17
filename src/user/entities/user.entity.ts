import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';

@Entity()
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

  @Column()
  Gender: string;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column({ nullable: true, default: null })
  CreatedBy: number | null;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @Column({ nullable: true, default: null })
  UpdatedBy: number | null;

  @DeleteDateColumn()
  DeletedAt: Date;
}
