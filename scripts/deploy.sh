#!/bin/bash

set -euo pipefail

cd ~/webapps/shopping-list

git fetch origin

git checkout main

git reset --hard origin/main

docker compose pull app

docker compose up -d