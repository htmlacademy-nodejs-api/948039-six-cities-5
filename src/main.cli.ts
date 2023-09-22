import {CLAApplication, HelpCommand, VersionCommand} from './cli/index.js';

const bootstrap = () => {
  const claApplication = new CLAApplication();
  claApplication.register([
    new VersionCommand(),
    new HelpCommand(),
  ]);
  claApplication.processCommand(process.argv);
};

bootstrap();
