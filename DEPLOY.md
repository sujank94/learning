```markdown
# How to build and deploy

This document shows commands and options to build the Docker image, push it to a registry,
and deploy the Kubernetes manifests supplied in k8s/.

## 1) Build locally and run
# Build:
docker build -t sample-node-app:local .

# Run:
docker run --rm -p 3000:3000 sample-node-app:local

Visit http://localhost:3000/health

## 2) Push to Docker Hub (example)
# Tag and push:
docker tag sample-node-app:local your-dockerhub-username/sample-node-app:latest
docker push your-dockerhub-username/sample-node-app:latest

## 3) Push to GitHub Container Registry (GHCR)
# Tag and push (locally)
docker build -t ghcr.io/<OWNER>/<REPO>:latest .
echo $CR_PAT | docker login ghcr.io -u <OWNER> --password-stdin
docker push ghcr.io/<OWNER>/<REPO>:latest

# Alternatively, use the provided GitHub Actions workflow which publishes images to GHCR on push.

## 4) Local k8s: minikube
# Option A: build inside minikube's docker:
eval $(minikube docker-env)
docker build -t sample-node-app:local .
kubectl apply -f k8s/namespace.yaml
# Edit k8s/deployment.yaml to use image: sample-node-app:local (or substitute __IMAGE__)
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
minikube service -n sample-node-app sample-node-app

# Option B: load image into minikube:
docker build -t sample-node-app:local .
minikube image load sample-node-app:local

## 5) Private registry / imagePullSecret
# Create a secret in the cluster to pull from GHCR or Docker Hub:
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<USERNAME> \
  --docker-password=<TOKEN> \
  --docker-email=you@example.com \
  -n sample-node-app

# Then add to k8s/deployment.yaml:
# imagePullSecrets:
#   - name: regcred

## 6) Deploy to cloud clusters
# GKE/EKS/AKS: configure kubeconfig locally (gcloud/eksctl/az aks get-credentials)
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml

## 7) GitHub Actions notes
# If you want the workflow to deploy, add a repository secret named KUBECONFIG that contains
# the base64-encoded kubeconfig file for the target cluster, and enable the deploy job in the workflow.

## Tips
- For production, add resource limits, affinity, and proper liveness/readiness tuning.
- Add an Ingress (with TLS) and a managed domain for production exposure.
- Use image tags with semver or git SHA for reproducible deployments.
```
