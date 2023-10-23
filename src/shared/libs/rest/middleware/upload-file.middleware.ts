import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import {nanoid} from 'nanoid';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class UploadFileMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        let validateError = null;
        const fileExtention = extension(file.mimetype);
        const isValid = fileExtention === 'jpg' || fileExtention === 'png';
        const filename = nanoid();
        if (!isValid) {
          validateError = new HttpError(
            StatusCodes.BAD_REQUEST,
            `Not vaild fileExtention: ${fileExtention}. Expected png or jpg`,
            'UploadFileMiddleware'
          );
        }
        callback(validateError, `${filename}.${fileExtention}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
