export interface UserWithEmailExists {
  existsWithEmail(email: string): Promise<boolean>;
}
