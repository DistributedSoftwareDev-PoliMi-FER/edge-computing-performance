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


# Example for cloud service

## get chat history

```
http://address:port/
```
The name of the event is `get`.
When the server receives this event, it sends to the client the chat history between the two user.

In this event the body must contain a JSON file:
```
{
    "userId": "userone"
}
```

## post message
```
http://address:port/
```
The name of the event is `post`.
This event is used to send a message to an other user.

In this event the body must contain a JSON file:
```
{
    "senderId": "userone",   //can be omitted
    "receiverId": "usertwo",
    "message": "bla bla bla"
}
```

## resolve username
```
http://address:port/
```
The name of the event is `resolve_username`.
This event is used to resolve a username into a userId.

In this event the body must contain a JSON file:
```
{
    "username": "userone",
}
```

## receive events by the client:

These are the correct events that the clients should be receive:
- history
- chat_message
- username_resolved

These are the events that the client should be receive in case of error
- message_format_error
- history_error
- username_not_found


