# ticket-microservices-app

To run locally:

```sh
docker-compose up
```

To build each container locally:

```sh
docker build -t _image name_ .
```

To publish each container to docker.io

```sh
docker push _image name_
```

To deploy to Okteto:

1. okteto namespace _namespace_
2. kubectl apply -k ./infra/k8s/kustomization/
3. kubectl apply -f ./infra/k8s/
