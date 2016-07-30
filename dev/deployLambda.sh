#!/bin/bash
cd ../js/lambdas/getAlbumDetails
rm lambda.zip
cd src
zip -r ../lambda.zip ./*
cd ..

if [ "$#" = 1 ] && [ "$1" = "--create" ]; then
    node ./deploy.js --create
else
    node ./deploy.js
fi
