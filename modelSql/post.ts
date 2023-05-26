import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/dbMysql';
import User from './user';

class Post extends Model {
  public id!: number;
  public text!: string;
  public blockPost!: boolean;
  public username!: string;
  public profileImg!: string;
  public image!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    blockPost: {
      type: DataTypes.BOOLEAN,
      // allowNull: false,
      defaultValue: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // userId: {
    //   type: DataTypes.INTEGER.UNSIGNED,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: 'id',
    //   },
    // },
  },
  {
    sequelize,
    modelName: 'Post',
    tableName: 'Post',
    underscored: true,
  },
);

// Define the association
// Post.belongsTo(User, { foreignKey: 'userId' });

export default Post;
