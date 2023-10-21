import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Types } from 'mongoose';
import { UserWithEmailExists } from '../../libs/rest/types/user-with-email-exists.interface.js';
import { UserExists } from '../../libs/rest/types/user-exists.interface.js';

export interface UserService extends UserWithEmailExists, UserExists {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
