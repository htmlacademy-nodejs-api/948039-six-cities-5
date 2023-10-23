import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { UserExists } from '../types/user-exists.interface.js';

export class UserExistsMiddleware implements Middleware {
  constructor(
    private readonly service: UserExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const userId = params[this.paramName];
    if (! await this.service.exists(userId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${userId} not found.`,
        'UserExistsMiddleware'
      );
    }

    next();
  }
}
