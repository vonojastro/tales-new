
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tales', 'root', 'mysql1324', {
  host: 'localhost',
  port: 3306, // Replace with your MySQL server port
  dialect: 'mysql'
});

export default sequelize;