import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImg: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: '',
  },
  profileImg: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const User = (mongoose.models.User as 
    mongoose.Model<IUser>) || model<IUser>('User', UserSchema);

export default User;
