#!/usr/bin/env bash

set -Eeuo pipefail

DHUB="${DHUB:-}"
TAG="${TAG:-latest}"
SERVICE="${SERVICE:-ncd}"
PORT="${PORT:-3000}"

CNAME="local-twd-${SERVICE}"
IMAGE="${DHUB}${CNAME}:${TAG}"
DOCKERFILE=".scripts/build/Dockerfile"
ENV_FILE=".env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

if [[ ! -f "$DOCKERFILE" ]]; then
  echo "Error: $DOCKERFILE not found"
  exit 1
fi

BUILD_ARGS=()

while IFS= read -r line || [[ -n "$line" ]]; do
  # Ignore comments and empty lines
  [[ -z "$line" || "$line" == \#* ]] && continue

  case "$line" in
    NEXT_PUBLIC_*=*)
      BUILD_ARGS+=(--build-arg "$line")
      ;;
  esac
done < "$ENV_FILE"

echo "Removing existing container: $CNAME"

if docker container inspect "$CNAME" >/dev/null 2>&1; then
  docker stop --time=20 "$CNAME"
  docker rm "$CNAME"
fi

if docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "Removing existing image: $IMAGE"
  docker image rm -f "$IMAGE"
fi

echo "Building image: $IMAGE"

docker build \
  "${BUILD_ARGS[@]}" \
  --tag "$IMAGE" \
  --file "$DOCKERFILE" \
  .

echo "Successfully built: $IMAGE"

# Quick local build
# BUILD_ARGS=$(grep '^NEXT_PUBLIC_' .env.local | sed 's/^/--build-arg /' | xargs)
# docker build $BUILD_ARGS -t $IMAGE -f .scripts/build/Dockerfile .;

# Multi platform build locally and push to dockerhub
# docker buildx build $BUILD_ARGS \
#   --platform linux/amd64,linux/arm64 \
#   -t samarpanda/twd-${SERVICE} \
#   -f .scripts/build/Dockerfile \
#   --push .
