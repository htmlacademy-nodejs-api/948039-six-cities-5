import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { CreateOfferDto } from './dto/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { ParamsDictionary } from 'express-serve-static-core';

export interface FindQuery {
  size?: string,
  city?: string,
}

export type UpdataeByIdRequestParams = {id: string} | ParamsDictionary;

export type DeleteByIdRequestParams = {id: string} | ParamsDictionary;

export type CreateRequest = Request<RequestParams, RequestBody, CreateOfferDto>;

export type UpdateByIdRequest = Request<UpdataeByIdRequestParams, RequestBody, UpdateOfferDto>;

export type FindRequest = Request<RequestParams, RequestBody, CreateOfferDto, FindQuery>;

export type FindByIdRequestParams = {id: string} | ParamsDictionary;
