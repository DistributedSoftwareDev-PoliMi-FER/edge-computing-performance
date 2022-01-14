import * as controller from '../controllers/business-controller';
import { EdgeNodeValidator, IdValidator } from '../model/EdgeNode';
import * as express from 'express';

const businessRouter = express.Router();

businessRouter.get('/', controller.get);

businessRouter.post('/', EdgeNodeValidator.constraints(), EdgeNodeValidator.validate, controller.post);

businessRouter.delete('/', IdValidator.constraints(), IdValidator.validate, controller.del);

businessRouter.put('/', EdgeNodeValidator.constraints(), EdgeNodeValidator.validate, controller.put);

export {businessRouter};