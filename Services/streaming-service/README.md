# Streaming Service

## Summary

This is the streaming service to be deployed on the main node.

## Local Development

To develop the service locally you need:

- Node 16+
- ffmpeg

Once you have all the dependency in place you have to create a `.env` file inside the main folder with all the required environment variables:

- `HTTP_PORT`: defines the port that the service will listen to
- `MONGODB_URL`: the connection string to the DB
- `API_SERVICE_HOST`: the link used to contact the main streaming service APIs (localhost for the main node)
- `STREAMKEY_SECRET`: the key used to generate the stream keys
- `AUTH0_API_URL`: the URI to contact Auth0 APIs
- `AUDIENCE`, `CLIENT_SECRET`, `CLIENT_ID`: used to access Auth0 APIs
- `EDGENODE_SECRET` : a shared secret between the edge nodes and the main node in order to secure sensitive endpoints

This is an example of the `.env` file:

```shell
MONGODB_URL=Here
HTTP_PORT=3000
API_SERVICE_HOST=http://localhost:8888
STREAMKEY_SECRET=SuperSecret
CLIENT_ID=ClientIdHere
CLIENT_SECRET=ClientSecretHere
AUDIENCE=Auth0ApiAudienceHere
AUTH0_API_URL=Auth0UriHere
EDGENODE_SECRET=SuperSecret
```

Once the `.env` file with all the environment variables is in place, you can go ahead and run:

```shell
npm i
npm start
```

This two commands, will install the dependencies and start the application.

After that you will have the service exposed on your machine. In order to verify that the service is working properly you could launch in another terminal shell:

```shell
curl http://localhost:3000/api/stream
```

As a result the terminal should return you the following message:

```json
{
	"name": "streaming-service-v2",
	"status": "OK",
	"message": "This is the streaming service of the main node"
}
```

## Available endpoints

### No need for authentication

- /api/stream (get): to check the status of the service
- /api/stream/public (get): to get all the streams publicly available
- /api/stream/`:streamId`/`:elem` (get): this endpoint is ment to be used for getting the specific chunks of the HLS live stream
- /api/stream/`:streamId` (get): this endpoint is ment to be used for getting all the unsensitive info about a specific stream

### Authentication required

- /api/stream/auth/private (get): to get all the private streams made available to me
- /api/stream/auth/mystream (get): to get all the data about user's own stream
- /api/stream/auth/mystream (delete): to delete user's own stream
- /api/stream/auth/new (post): create a new stream for the authenticated user

```json
// Expected body of the post request
{
	"title": "type String",
	"thumbnail": "type String",
	"description": "type String",
	"type": "PRIVATE",
	"invited": ["umessuti"] // An array of usernames.
	// This array can also be omitted or sent empty and
	// hence the stream will be set PUBLIC
}
```

- /api/stream/auth/update (post): update the stream data for the authenticated user

```json
// Expected body of the post request
{
	"title": "type String",
	"thumbnail": "type String",
	"description": "type String",
	"type": "PRIVATE",
	"invited": ["umessuti"] // An array of usernames.
	// This array can also be omitted or sent empty and
	// hence the stream will be set PUBLIC
}
```

Right now there is also a test endpoint that will inject directly in the backend the user data /api/stream/`fakeauth`/[...]

## Contributions

To contribute to the project, please be mindful for this simple rules:

1. Don’t commit directly on master
2. Start your branches with `feature/` or `fix/` based on the content of the branch
3. If possible, refer to the Jira issue id, inside the name of the branch, but not call it only `fix/BAAST3000`
4. Always commit in english
5. Once you are happy with your branch, open a [Merge Request][merge-request]

[nvm]: https://github.com/creationix/nvm
[merge-request]: https://git.tools.mia-platform.eu/clients/polimi/edge-computing/services/streaming-service-edge/merge_requests
