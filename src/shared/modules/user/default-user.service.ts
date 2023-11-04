import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { Types } from 'mongoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { DEFAULT_AVATAR_FILE_NAME } from './index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME });
    user.setPassword(dto.password, salt);

    return await this.userModel.create(user);
  }

  public async findById(id: Types.ObjectId): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id);
  }

  public async updateById(id: Types.ObjectId, avatar: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(id, {avatar}, {new: true}).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async existsWithEmail(email: string): Promise<boolean> {
    return await this.userModel.findOne({email}) !== null;
  }

  public async exists(userId: string): Promise<boolean> {
    return this.userModel.exists({_id: userId}) !== null;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
