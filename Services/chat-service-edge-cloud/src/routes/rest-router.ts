import * as express from 'express';
import {MessageValidator} from '../model/message-to-save';
import * as controller from '../controllers/rest-controller';

// Router for the request from an edge node
const router = express.Router();
/**
 * @swagger
 * /chatHistory/:
 *   get:
 *     summary: Returns the chat history of the users specified in the request
 *     description: Returns the chat history of the users specified in the request
 *     parameters:
 *       - name: userOneId
 *         in: query
 *         description: The user id of the first user of the chat history that the service has to return
 *         required: true
 *         type: string
 *       - name: userTwoId
 *         in: query
 *         description: The user id of the second user of the chat history that the service has to return
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: valid requests, chat history found
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/ChatHistroy"
 *       500:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Errors"
 */
router.get('/chatHistory/', controller.getChatHistory);

/**
 * @swagger
 * /chatOverview/:
 *   get:
 *     summary: Returns the chat overview of the user specified in the request
 *     description: Returns the chat overview of the user specified in the request
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The user id of the  user of the chat overview that the service has to return
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: valid requests, chat overview found
 *         schema:
 *           $ref: "#/definitions/ChatOverview"
 *       500:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Errors"
 */
router.get('/chatOverview/', controller.getChatOverview);

/**
 * @swagger
 * /:
 *   post:
 *     summary: The edge nodes sends a message with this request
 *     description: The edge nodes uses this request to store the messages in the database of the main server
 *     parameters:
 *     - in: "body"
 *       name: "body" 
 *       description: message to store
 *       required: true
 *       schema: 
 *         $ref: "#/definitions/Message"
 *              
 *     responses:
 *       200:
 *         description: The request arrives correctly and the massage was stored
 *       500:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Errors"  
 */
router.post('/', MessageValidator.constrains(), MessageValidator.validate, controller.post);


export {router};