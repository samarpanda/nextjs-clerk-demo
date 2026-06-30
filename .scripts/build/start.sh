#!/bin/sh

export LC_ALL=en_US.UTF-8

#docker build --build-arg NEXT_PUBLIC_APP_URL=https://nextpublicappurl.com -t my-next-app:0.0.1 .
docker run --rm -p 3000:3000 --env-file .env.local nextjs-clerk-demo:0.0.1