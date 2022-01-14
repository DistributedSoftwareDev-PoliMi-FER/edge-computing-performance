import * as express from 'express';
import * as controller from '../controllers/rest-controller';
import { IdUserEdgeNodeValidator, UserIdValidator, NodeIdValidator } from '../model/model';

const router = express.Router();

router.get('/:idUser',  controller.get);

// These methods do a check on the request and after pass the parameters to the next function with a middlewere
router.post('/', IdUserEdgeNodeValidator.constraints(), IdUserEdgeNodeValidator.validate, controller.post);

router.delete('/user/', UserIdValidator.constraints(), UserIdValidator.validate,  controller.delByUser);

router.delete('/byAll/', IdUserEdgeNodeValidator.constraints(), IdUserEdgeNodeValidator.validate, controller.delByAll);

//This method deletes all the user "query" of the users that are connected to the same node, (the node is the parameter of the request)
router.delete('/node/', NodeIdValidator.constraints(), NodeIdValidator.validate, controller.delByEdgeNode);

router.put('/', IdUserEdgeNodeValidator.constraints(), IdUserEdgeNodeValidator.validate, controller.put);

export {router};

