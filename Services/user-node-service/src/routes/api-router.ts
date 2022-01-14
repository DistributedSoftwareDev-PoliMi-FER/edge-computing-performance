import * as express from 'express';
import * as  swaggerUi from 'swagger-ui-express';
import * as swaggerSpec from '../utils/swagger.json';


const apiRouter = express.Router();

// Serve a swagger page
apiRouter.use('/openapi', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export {apiRouter};
