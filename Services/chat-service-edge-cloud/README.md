# Chat Service for Edge Node Architecture

# /routes
Here we have the code that binds the controllers methods to a specific endpoint, and nothing more.

# /controllers
Here we have the code which calls the services. We don't have any purely business code, but here we chain toghether business code with REST logic.

# /services
Here we have pure business code ando nothing more. No traces of REST should be found.

# /db
Database access layer, no business code.

# How to use
1. Open a terminal window
2. `tsc` to compile
3. `build/index.js` to run;
4. Use a service like [Postman](https://www.postman.com/downloads/) to test the both the service


5. Modify the .env file for setting:
    - the MONGODB_URL;
    - HTTP_PORT;

# how run test
Internet connection is required to run the test

1. Open a terminal windows and ho to the directory user-node-service;
2. `tsc` to compile;
3. `npm run test` to run test;

for test coverage: `npm run coverage`



# Example
General http: 

```
http://address:port/
```
`address` is the address of the machine on which the service is running.

`port` is the port on which the service is running.

## GET Request

1. for the chat history 


```
http://address:port/chatHistory/
```
`userOneId` and `userTwoId` are the user ids of which the node wants the chat history. 
These parameters are put like a query (the `valueOne` and `valueTwo` must be adapt to the request)

```
http://address:port/chatHistory/?userOneId=valueOne&userTwoId=valueTwo
```


2. for the chat overview

```
http://address:port/chatOverview/
```
`userId` is the user id of which the node wants the chat overview. 
This parameter is put like a query (the `value` must be adapt to the request)

```
http://address:port/chatOverview/?userId=value
```



## POST Request
```
http://address:port/fromNode/
```
In this request the body must contain a JSON file:
```
{
    "senderId": "userone",
    "receiverId": "usertwo",
    "message": "bla bla bla"
}
```
