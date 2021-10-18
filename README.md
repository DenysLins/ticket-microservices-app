# ticket-microservices-app

To run locally:

docker-compose up

To deploy to Okteto:

1. okteto namespace _namespace_
2. kubectl apply -k ./infra/k8s/kustomization/
3. kubectl apply -f ./infra/k8s/
