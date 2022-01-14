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
2. `tsc.cmd` to compile
3. `build/best_node_selector.js` to run
4. Use a service like [Postman](https://www.postman.com/downloads/) to test the RESTful API


# nodejs-custom-plugin

## Summary

This is the best template to start creating a service in node integrated inside the platform

## Local Development

To develop the service locally you need:

- Node 10+

To setup node, please if possible try to use [nvm][nvm], so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install`, the `.nvmrc` file will install and select the correct version if you don’t already have it.

Once you have all the dependency in place, you can launch:

```shell
npm i
npm run coverage
```

This two commands, will install the dependencies and run the tests with the coverage report that you can view as an HTML
page in `coverage/lcov-report/index.html`.
After running the coverage you can create your local copy of the default values for the `env` variables needed for
launching the application.

```shell
cp ./default.env ./local.env
```

From now on, if you want to change anyone of the default values for the variables you can do it inside the `local.env`
file without pushing it to the remote repository.

Once you have all your dependency in place you can launch:

```shell
set -a && source local.env
npm start
```

After that you will have the service exposed on your machine. In order to verify that the service is working properly you could launch in another terminal shell:

```shell
curl http://localhost:3000/-/ready
```

As a result the terminal should return you the following message:

```json
{"name":"nodejs-template","status":"OK","version":"0.1.0"}
```

## Contributing

To contribute to the project, please be mindful for this simple rules:

1. Don’t commit directly on master
2. Start your branches with `feature/` or `fix/` based on the content of the branch
3. If possible, refer to the Jira issue id, inside the name of the branch, but not call it only `fix/BAAST3000`
4. Always commit in english
5. Once you are happy with your branch, open a [Merge Request][merge-request]

## Run the Docker Image

If you are interested in the docker image you can get one and run it locally with this commands:

```shell
docker pull nexus.mia-platform.eu/edge-computing/nodejs-template:latest
set -a
source .env
docker run --name nodejs-template \
  -e USERID_HEADER_KEY=${USERID_HEADER_KEY} \
  -e GROUPS_HEADER_KEY=${GROUPS_HEADER_KEY} \
  -e CLIENTTYPE_HEADER_KEY=${CLIENTTYPE_HEADER_KEY} \
  -e BACKOFFICE_HEADER_KEY=${BACKOFFICE_HEADER_KEY} \
  -e MICROSERVICE_GATEWAY_SERVICE_NAME=${MICROSERVICE_GATEWAY_SERVICE_NAME} \
  -e LOG_LEVEL=trace \
  -p 3000:3000 \
  --detach \
  nexus.mia-platform.eu/edge-computing/nodejs-template
```

[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/clients/polimi/edge-computing/services/location-service/merge_requests
