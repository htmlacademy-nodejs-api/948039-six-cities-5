import convict from 'convict';
import validator from 'convict-format-with-validator';
export type RestSchema = {
  PORT: number,
  SALT: string,
  DB_HOST: string,
}

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  PORT: {
    desc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 3000
  },
  SALT: {
    desc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    desc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  }
});
