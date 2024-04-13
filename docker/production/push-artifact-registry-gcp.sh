#!/bin/bash

# docker compose build
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
docker tag si-rene-be:latest asia-southeast1-docker.pkg.dev/si-rene-app/si-rene-be/si-rene-be:latest
docker push asia-southeast1-docker.pkg.dev/si-rene-app/si-rene-be/si-rene-be:latest