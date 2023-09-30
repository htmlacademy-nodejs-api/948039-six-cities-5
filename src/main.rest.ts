import { RestApplication } from './rest/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';

const bootstrap = () => {
  const logger = new PinoLogger();
  const claApplication = new RestApplication(logger);

  claApplication.init();
};

bootstrap();
