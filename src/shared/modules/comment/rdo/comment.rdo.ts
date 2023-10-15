import { Expose, Transform } from 'class-transformer';

export class CommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rate: number;

  @Expose()
  public createdAt: string;

  @Expose()
  @Transform(({value}) => value.toString())
  public userId: string;
}
