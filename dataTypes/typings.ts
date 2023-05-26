export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PostData {
  userId: number;
  _id?: number | any;
  text: string;
  image: string | undefined;
  username: string;
  profileImg: string;
  comments?: CommentData[] | CommentData;
  likes?: LikesData[] | LikesData;
  createdAt?: any; // convert to string
  updatedAt?: any;
}

export interface UserTypes {
  id?: number | any;
  name?: string | any;
  email?: string | any;
  image?: string | any;
  profileImg?: string;
}

export interface CommentData {
  id?: number | any;
  comment?: string;
  user?: string;
  profImg?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface LikesData {
  user: string;
  profImg: string;
  _id?: number | any;
  userId?: number | any;
  userEmail: string;
  createdAt?: any;
  updatedAt?: any;
}