#!/usr/bin/env bash
set -e

DHUB="${DHUB:-}"
TAG="${TAG:-latest}"
SERVICE="${SERVICE:-ncd}"
PORT="${PORT:-3000}"
CNAME=local-twd-${SERVICE}
IMAGE="${DHUB}${CNAME}:${TAG}"


echo "starting container ${CNAME}"
docker run -d --name $CNAME --env-file .env.local -p $PORT:3000 $IMAGE
#docker run --rm --name $CNAME --env-file .env.local -p $PORT:3000 $IMAGE
