import { RestApplication } from './rest/index.js';
import { RestConfig } from './shared/libs/config/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';

const bootstrap = () => {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const claApplication = new RestApplication(logger, config);

  claApplication.init();
};

bootstrap();
