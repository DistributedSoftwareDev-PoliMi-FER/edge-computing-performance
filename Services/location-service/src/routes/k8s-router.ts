import * as express from 'express';
import { get } from '../controllers/k8s-controller';

const k8sRouter = express.Router();

k8sRouter.get('/-/healthz', get);

k8sRouter.get('/-/ready', get);

k8sRouter.get('/documentation/json');

export {k8sRouter};