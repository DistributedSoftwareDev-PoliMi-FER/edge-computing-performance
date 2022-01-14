import * as express from 'express';
import * as controller from '../controllers/rest-controller';

const businessRouter = express.Router();

businessRouter.post('/api/chat-service-edge-node/', controller.post);

export {businessRouter};