import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class PublicRouteMiddleware implements Middleware {
  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (tokenPayload !== undefined) {
      throw new HttpError(
        StatusCodes.METHOD_NOT_ALLOWED,
        'Not allow authorized person',
        'PublicRouteMiddleware'
      );
    }

    return next();
  }
}
