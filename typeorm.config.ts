import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'nesttest',
  migrations: ['migrations/*.ts'],
  entities: [User, Owner, Hotel],
});
