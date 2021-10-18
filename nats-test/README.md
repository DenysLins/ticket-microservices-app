# nats-test

This is a small project used to understand [NATS Streaming Server](https://github.com/nats-io/nats-streaming-server)

To run the NATS-server:

```sh
docker run -p 4222:4222 -p 8222:8222 nats-streaming -p 4222 -m 8222
```

To run the publisher:

```sh
yarn publisher
```

To run the listener:

```sh
yarn listener
```
