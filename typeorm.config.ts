import { DataSource } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Owner } from 'src/entity/owner.entity';
import { Hotel } from 'src/entity/hotel.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'nesttestmigrate',
  migrations: ['migrations/*.ts'],
  entities: [User, Owner, Hotel],
});
