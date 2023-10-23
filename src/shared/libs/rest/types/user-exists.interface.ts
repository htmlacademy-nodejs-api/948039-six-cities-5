export interface UserExists {
  exists(userId: string): Promise<boolean>;
}
