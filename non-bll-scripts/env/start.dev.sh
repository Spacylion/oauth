#!/bin/bash

if [ ! -f ../../src/config/env/development.env ]; then
  echo "ENV file ../src/config/env/development.env not  found!"
  exit 1
fi

docker-compose --env-file ../../src/config/env/development.env up -d

docker-compose logs -f
