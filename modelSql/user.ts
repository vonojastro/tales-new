import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/dbMysql';
// import sequelize from '../utils/dbPg';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public profileImg!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
User.init({
  // Attributes
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  profileImg: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  }
}, {
  sequelize, // Connection instance
  modelName: 'Users', // Model name
  tableName: 'Users',
    underscored: true,
});

export default User;