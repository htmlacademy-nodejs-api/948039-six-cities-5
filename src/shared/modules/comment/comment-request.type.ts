import { Request } from 'express';
import { RequestBody } from '../../libs/rest/index.js';
import { CreateCommentDto } from './dto/create-comment-dto.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type CreateByIdRequestParams = {id: string} | ParamsDictionary;
export type FindByIdRequestParams = {id: string} | ParamsDictionary;
export type CreateCommentRequest = Request<CreateByIdRequestParams, RequestBody, CreateCommentDto>;

