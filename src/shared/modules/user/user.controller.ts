import { inject } from 'inversify';
import { BaseController, HttpMethod, PrivateRouteMiddleware, PublicRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultUserService } from './default-user.service.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import { UserRdo } from './rdo/user.rdo.js';
import { fillDTO } from '../../helpers/index.js';
import { CreateUserRequest, LoginUserRequest, UpdateByIdRequestParams } from './user-request.type.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserWithEmailExistsMiddleware } from '../../libs/rest/middleware/user-with-email-exists.middleware.js';
import mongoose from 'mongoose';
import { UserExistsMiddleware } from '../../libs/rest/middleware/user-exists.middleware.js';
import { AuthService } from '../auth/index.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';

export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.Config) private readonly config: RestConfig,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [
        new PublicRouteMiddleware(),
        new UserWithEmailExistsMiddleware(this.userService, 'User'),
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkIsLogin,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/avatar/:id',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new UserExistsMiddleware(this.userService, 'User', 'id'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
    this.addRoute({ path: '/logout', method: HttpMethod.Delete, handler: this.logout });
  }

  public async register({ body }: CreateUserRequest, res: Response): Promise<void> {
    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async checkIsLogin({tokenPayload}: Request, res: Response): Promise<void> {
    const userId = new mongoose.Types.ObjectId(tokenPayload.id);
    const user = await this.userService.findById(userId);
    this.ok(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar({params, file}: Request<UpdateByIdRequestParams>, res: Response) {
    const id = new mongoose.Types.ObjectId(params.id);
    await this.userService.updateById(id, file!.filename);
    this.created(res, {
      filepath: file?.path
    });
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    this.ok(res, {});
  }
}
