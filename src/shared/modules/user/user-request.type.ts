import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type UpdateByIdRequestParams = {id: string} | ParamsDictionary;
export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
