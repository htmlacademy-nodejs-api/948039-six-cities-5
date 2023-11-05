import { Expose, Transform } from 'class-transformer';

export class CommentRdo {
  @Expose()
  @Transform((query) => query.obj['_id'])
  public id: string;

  @Expose()
  public text: string;

  @Expose()
  public rate: number;

  @Expose()
  public createdAt: string;

  @Expose()
  @Transform((query) => query.obj[query.key])
  public userId: string;
}
