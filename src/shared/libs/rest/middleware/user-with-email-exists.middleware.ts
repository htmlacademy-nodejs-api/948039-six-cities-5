import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { UserWithEmailExists } from '../types/user-with-email-exists.interface.js';

export class UserWithEmailExistsMiddleware implements Middleware {
  constructor(
    private readonly service: UserWithEmailExists,
    private readonly entityName: string,
  ) {}

  public async execute({ body }: Request, _res: Response, next: NextFunction): Promise<void> {
    const {email} = body;
    if (await this.service.existsWithEmail(email)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `${this.entityName} with email: ${email} exist.`,
        'UserWithEmailExistsMiddleware'
      );
    }

    next();
  }
}
