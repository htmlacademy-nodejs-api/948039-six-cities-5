import { UserTypeEnum } from './index.js';

export type User = {
  name: string;
  email: string;
  avatar: string;
  password: string;
  type: UserTypeEnum;
}
