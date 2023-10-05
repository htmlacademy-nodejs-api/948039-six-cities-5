#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand} from './cli/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';

import { createSLIApplication } from './cli/cli.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';

const bootstrap = () => {
  const cliContainer = Container.merge(createSLIApplication(), createUserContainer(), createOfferContainer());
  const claApplication = cliContainer.get<CLIApplication>(Component.CLIApplication);
  const importCommand = cliContainer.get<ImportCommand>(Component.ImportCommand);
  claApplication.register([
    new VersionCommand(),
    new HelpCommand(),
    importCommand,
    new GenerateCommand(),
  ]);

  claApplication.processCommand(process.argv);
};

bootstrap();
