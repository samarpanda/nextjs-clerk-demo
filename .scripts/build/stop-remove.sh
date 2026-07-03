#!/usr/bin/env bash

set -Eeuo pipefail

DHUB="${DHUB:-}"
TAG="${TAG:-latest}"
SERVICE="${SERVICE:-ncd}"
PORT="${PORT:-3000}"

CNAME="local-twd-${SERVICE}"
IMAGE="${DHUB}${CNAME}:${TAG}"

if docker container inspect "$CNAME" >/dev/null 2>&1; then
  echo "Removing existing container: $CNAME"
  docker stop --time=20 "$CNAME"
  docker rm "$CNAME"
fi

if docker image inspect "$IMAGE" >/dev/null 2>&1; then
  echo "Removing existing image: $IMAGE"
  docker image rm -f "$IMAGE"
fi
