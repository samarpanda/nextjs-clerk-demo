#!/bin/bash
set -e

BUILD_ARGS=$(grep '^NEXT_PUBLIC_' .env.local | gsed 's/^/--build-arg /' | xargs)

docker build $BUILD_ARGS -t nextjs-clerk-demo:0.0.1 -f .scripts/build/Dockerfile .

#docker buildx build $BUILD_ARGS \
#  --platform linux/amd64,linux/arm64 \
#  -t samarpanda/nextjs-clerk-demo:0.0.1 \
#  -f .scripts/build/Dockerfile \
#  --push .