#!/bin/bash

cd frontend || exit
yarn build
rm -rf ../src/main/resources/static/dist
cp -r dist ../src/main/resources/static/dist
cd ..
./mvnw clean package -Dmaven.test.skip=true