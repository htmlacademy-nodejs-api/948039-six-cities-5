import { inject } from 'inversify';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { DefaultUserService } from './default-user.service.js';
import { CreateUserDto } from './dto/index.js';
import { RestConfig } from '../../libs/config/rest.config.js';
import {StatusCodes} from 'http-status-codes';
import { UserRdo } from './rdo/user.rdo.js';
import { fillDTO } from '../../helpers/index.js';

export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: DefaultUserService,
    @inject(Component.Config) private readonly config: RestConfig,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkIsLogin });
    this.addRoute({ path: '/logout', method: HttpMethod.Get, handler: this.logout });
  }

  public async register({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      const existUserError = new Error(`User with email «${body.email}» exists.`);
      this.send(res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        { error: existUserError.message }
      );

      return this.logger.error(existUserError.message, existUserError);
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public login(_req: Request, res: Response): void {
    const NotImplementedError = new Error('This methods not implements.');
    this.send(res,
      StatusCodes.NOT_IMPLEMENTED,
      { error: NotImplementedError.message }
    );
  }

  public checkIsLogin(_req: Request, res: Response): void {
    const NotImplementedError = new Error('This methods not implements.');
    this.send(res,
      StatusCodes.NOT_IMPLEMENTED,
      { error: NotImplementedError.message }
    );
  }

  public logout(_req: Request, res: Response): void {
    const NotImplementedError = new Error('This methods not implements.');
    this.send(res,
      StatusCodes.NOT_IMPLEMENTED,
      { error: NotImplementedError.message }
    );
  }
}
