#!/usr/bin/env node
import {CLAApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand} from './cli/index.js';

const bootstrap = () => {
  const claApplication = new CLAApplication();
  claApplication.register([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);
  claApplication.processCommand(process.argv);
};

bootstrap();
