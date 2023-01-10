import 'dotenv/config';

import express from 'express';
import 'express-async-errors'; // Since this project is using Express v4, this is required to handle exceptions correctly in async route handlers
import pinoHttp from 'pino-http';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import helmet from 'helmet';
import YAML from 'yamljs';

import { createStationsController } from './controllers';
import { logger } from './utils/logger';
import { createAuthenticationMiddleware } from './middlewares';

const app = express();

// Apply CORS & security-related middleware
app.use(cors());
app.use(helmet());

// Apply a request body parser middleware
app.use(express.json());

// Apply a custom logger
app.use(pinoHttp({ logger: logger }));

// Render OpenAPI docs on /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load(`${__dirname}/openapi.yaml`)));

// Validate that API-s input and output matches what is defined in the spec
app.use(
  '/api/stations',
  OpenApiValidator.middleware({
    apiSpec: `${__dirname}/openapi.yaml`,
    validateRequests: true,
    validateResponses: false,
  })
);

// Apply authentication middleware
app.use('/api/stations', createAuthenticationMiddleware());

// Map routes to controllers
app.use('/api/stations', createStationsController());

app.listen(process.env.PORT ?? 3080, () => {
  logger.info('Application started on port 3080!');
});
