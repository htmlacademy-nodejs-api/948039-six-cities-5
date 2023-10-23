import { inject } from 'inversify';
import { BaseController, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultUserService } from './default-user.service.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import {StatusCodes} from 'http-status-codes';
import { UserRdo } from './rdo/user.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserRequest, UpdateByIdRequestParams } from './user-request.type.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserWithEmailExistsMiddleware } from '../../libs/rest/middleware/user-with-email-exists.middleware.js';
import mongoose from 'mongoose';
import { UserExistsMiddleware } from '../../libs/rest/middleware/user-exists.middleware.js';

export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.Config) private readonly config: RestConfig,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [
        new UserWithEmailExistsMiddleware(this.userService, 'User'),
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkIsLogin });
    this.addRoute({ path: '/logout', method: HttpMethod.Get, handler: this.logout });
    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new UserExistsMiddleware(this.userService, 'User', 'id'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async register({ body }: CreateUserRequest, res: Response): Promise<void> {
    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public login(_req: Request, _res: Response): void {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'This methods not implements.',
      'UserController'
    );
  }

  public checkIsLogin(_req: Request, _res: Response): void {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'This methods not implements.',
      'UserController'
    );
  }

  public logout(_req: Request, _res: Response): void {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'This methods not implements.',
      'UserController'
    );
  }

  public async uploadAvatar({params, file}: Request<UpdateByIdRequestParams>, res: Response) {
    const id = new mongoose.Types.ObjectId(params.id);
    await this.userService.updateById(id, file!.filename);
    this.created(res, {
      filepath: file?.path
    });
  }
}
