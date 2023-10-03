export interface DatabaseClient {
  connect(uri:string): Promise<void>;
  disconect(): Promise<void>;
}
