import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/dbMysql';

class Comment extends Model {
  public id!: number;
  public comment!: string;
  public profileImg!: string;
  public image!: string;
  public postId!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'Post',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Comment',
  },
);

export default Comment;
