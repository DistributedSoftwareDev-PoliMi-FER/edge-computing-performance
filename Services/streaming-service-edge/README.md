# nodejs-custom-plugin

## Summary

This is the streaming service to be deployed on the edge nodes.

## Local Development

To develop the service locally you need:

- Node 16+
- ffmpeg (under `/usr/bin`)

Once you have all the dependency in place you have to create a `.env` file inside the main folder with all the required environment variables:

- `EDGE_HTTP_PORT`: defines the port that the service will listen to
- `STREAM_SERVICE_HOST`: the local streaming service (right now will be always localhost)
- `MAIN_API_SERVICE_HOST`: the link used to contact the main streaming service APIs
- `RTMP_MAIN_SERVER`: the link used to contact the main streaming service for the actual retrieval of the remote stream
- `EDGENODE_SECRET`: the secret to generate the apikey to use when contacting the main node

This is an example of the `.env` file:

```shell
EDGE_HTTP_PORT=4000
STREAM_SERVICE_HOST='http://localhost:7777'
MAIN_API_SERVICE_HOST='https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu'
RTMP_MAIN_SERVER='rtmp://35.205.136.156'
EDGENODE_SECRET=NeverGonnaGiveYouUp
```

Once the `.env` file with all the environment variables is in place, you can go ahead and run:

```shell
npm i
npm start
```

This two commands, will install the dependencies and start the application.

After that you will have the service exposed on your machine. In order to verify that the service is working properly you could launch in another terminal shell:

```shell
curl http://localhost:4000/api/service
```

As a result the terminal should return you the following message:

```json
{
	"name": "streaming-service-edge",
	"status": "OK",
	"message": "This is the streaming service of the edge nodes"
}
```

## Available endpoints

- /api/stream : to check the status of the service
- /api/stream/`:streamId`/`:elem` : this endpoint is ment to be used for getting the specific chunks of the HLS live stream
- All the other endpoints of the streaming service

## Tests

In order to run the tests it's required to have installed 7z (p7zip-full on linux) and it's also required to start the tests with some additional environment variables required by the local main node that we need to spin-up:

```
API_SERVICE_HOST=http://localhost:8888
STREAMKEY_SECRET=NeverGonnaGiveYouUp
CLIENT_ID=tEydfVBObitQV0a048IAMuip1iQXPmTO
CLIENT_SECRET=HPSnoxep7F9k-sOmZ6NwhpmLZTk9PzySVT_ag2auyzefzZej8OmXxYJiF1wTyrFM
AUDIENCE=https://polimi-edge-computing.eu.auth0.com/api/v2/
AUTH0_API_URL=https://polimi-edge-computing.eu.auth0.com
```

Eventually, when all the required dependencies are available locally, it's possible to run the tests entering the following commands:

```bash
npm run unzip-test
npm run test
```

NB: the `unzip-test` command is used to unzip a local version of the main streaming service node. It's also possible to pull automatically the repo of the streaming service during the tests but it's not always consistent in the output and hence it's been decided to zip the main streaming service and unzip it when needed.
It's suggested to update the zip for every non backwards compatible update of the streaming service.

## Contributions

To contribute to the project, please be mindful for this simple rules:

1. Don’t commit directly on master
2. Start your branches with `feature/` or `fix/` based on the content of the branch
3. If possible, refer to the Jira issue id, inside the name of the branch, but not call it only `fix/BAAST3000`
4. Always commit in english
5. Once you are happy with your branch, open a [Merge Request][merge-request]

[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/clients/polimi/edge-computing/services/streaming-service-edge/merge_requests
