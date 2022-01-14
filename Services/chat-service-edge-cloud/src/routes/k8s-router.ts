import * as express from 'express';
import * as controller from '../controllers/k8s-controller';

const k8sRouter = express.Router();

k8sRouter.get('/-/healthz', controller.health);

k8sRouter.get('/-/ready', controller.health);

export {k8sRouter};