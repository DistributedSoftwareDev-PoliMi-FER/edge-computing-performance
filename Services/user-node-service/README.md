# /routes
Here we have the code that binds the controllers methods to a specific endpoint, and nothing more.

# /controllers
Here we have the code which calls the services. We don't have any purely business code, but here we chain toghether business code with REST logic.

# /services
Here we have pure business code ando nothing more. No traces of REST should be found.

# /db
Database access layer, no business code.

# How to use
1. Open a terminal window with admin privileges and go to the directory where this file is placed
2. `tsc` to compile
3. `build/index.js` to run;
4. Use a service like [Postman](https://www.postman.com/downloads/) to test the RESTful API

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

```
http://address:port/idUser
```
`idUser` is the id of the user information that you want to obtain.
In this request the body must be empty
## POST Request
```
http://address:port/
```
In this request the body must contain a JSON file:
```
{
    "idUser": "userone",
    "ipEdgenode": "172.0.0.1"
}
```
## UPDATE/PUT Request
```
http://address:port/
```
In this request the body must contain a JSON file:
```
{
    "idUser": "userone",
    "ipEdgenode": "172.0.0.1"
}
```
## DELETE Request
This type of request has two different endpoints for two different function:
1. Delete only one user ( when the client disconnects ), so the request delete a specified user : 
```
http://address:port/
```
In this request the body must contain a JSON file:
```
{
    "idUser": "userone"
}
```

2. Delete all users connected to a specifiec node ( when the node disconnects ):
```
http://address:port/node
```
In this request the body must contain a JSON file:
```
{
    "ipEdgenode": "172.0.0.1"
}
```
