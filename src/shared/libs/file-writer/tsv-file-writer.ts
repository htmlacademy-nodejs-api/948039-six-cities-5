import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriter } from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(path: string) {
    this.stream = createWriteStream(path, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true,
    });
  }

  async write(row: string): Promise<unknown> {
    const a = this.stream.write(`${row}\n`);
    if (! a) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve(true));
      });
    }
    return Promise.resolve(true);
  }
}
