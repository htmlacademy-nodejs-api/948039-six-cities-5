// import { readFileSync } from 'node:fs';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import EventEmitter from 'node:events';

const CHUNK_SIZE = 16384; // 16KB
export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly path: string) {
    super();
  }

  read(): void {
    const stream = createReadStream(this.path, {
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE
    });
    let content = '';
    let importedRowCount = 0;

    stream.on('data', (chunk: Buffer) => {
      content += chunk.toString();

      while (content.indexOf('\n') >= 0) {
        let nextLinePosition = content.indexOf('\n');
        const completeRow = content.slice(0, nextLinePosition + 1);
        content = content.slice(++nextLinePosition);
        importedRowCount++;
        this.emit('line', completeRow);
      }
    });

    stream.on('end', () => {
      this.emit('end', importedRowCount);
    });
  }
}
