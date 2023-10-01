export interface Config<U> {
  get<T extends keyof U>(name: T): U[T]
}
