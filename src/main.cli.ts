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
  const versionCommand = cliContainer.get<VersionCommand>(Component.VersionCommand);
  const helpCommand = cliContainer.get<HelpCommand>(Component.HelpCommand);
  const importCommand = cliContainer.get<ImportCommand>(Component.ImportCommand);
  const generateCommand = cliContainer.get<GenerateCommand>(Component.GenerateCommand);
  claApplication.register([
    versionCommand,
    helpCommand,
    importCommand,
    generateCommand,
  ]);

  claApplication.processCommand(process.argv);
};

bootstrap();
