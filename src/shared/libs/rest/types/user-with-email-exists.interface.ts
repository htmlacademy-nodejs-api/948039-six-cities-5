export interface UserWithEmailExists {
  exists(email: string): Promise<boolean>;
}
