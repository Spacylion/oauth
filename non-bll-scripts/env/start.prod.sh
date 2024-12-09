#!/bin/bash

if [ ! -f ../../src/config/env/production.env ]; then
  echo "ENV file ../src/config/env/production.env not  found!"
  exit 1
fi

docker-compose --env-file ../../src/config/env/production.env up -d

docker-compose logs -f
