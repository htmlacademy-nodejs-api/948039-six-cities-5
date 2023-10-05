import { injectable } from 'inversify';
import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

@injectable()
export class CLIApplication {
  private commandsCollection: CommandCollection = {};
  private defaultCommand: string = '--help';

  public register(commands: Command[]): void {
    commands.forEach((command) => {
      if (Object.hasOwn(this.commandsCollection, command.getName())) {
        throw new Error(`${command.getName()}: is alredy exist`);
      } else {
        this.commandsCollection[command.getName()] = command;
      }
    });
  }

  private getDefaultCommand(): Command | never {
    if (!Object.hasOwn(this.commandsCollection, this.defaultCommand)) {
      throw new Error(`this defauilt command [${this.defaultCommand}]: is not registered`);
    }
    return this.commandsCollection[this.defaultCommand];
  }

  private getCommand(commandName: string): Command {
    return this.commandsCollection[commandName] ?? this.getDefaultCommand();
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArgiments = parsedCommand[commandName] ?? [];
    command.execute(...commandArgiments);
  }
}
