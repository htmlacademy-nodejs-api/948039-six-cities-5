import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { ObjectId } from 'mongoose';

export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    return UserModel.create(user);
  }

  async findById(id: ObjectId): Promise<DocumentType<UserEntity> | null> {
    return UserModel.findById(id);
  }

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return UserModel.findOne({email});
  }

}
