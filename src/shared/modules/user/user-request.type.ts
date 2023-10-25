import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ParamsDictionary } from 'express-serve-static-core';
import { LoginUserDto } from './index.js';

export type UpdateByIdRequestParams = {id: string} | ParamsDictionary;
export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
