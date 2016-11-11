#!/bin/sh

# Redis and proxy

echo 'Creating droplet for redis and proxy...'
node redisAndProxy.js
# sleep 12

cp redisServer.txt ./autoscale
cp redisServer.txt ./canary
cp redisServer.txt ./feature_flag
cp redisServer.txt ./prod
cp redisServer.txt ./proxy

# #Production
cd prod
echo 'Creating production droplet'
node production.js
# sleep 10

# #Canary
cd ../canary
echo 'Creating canary droplet'
node canary.js
# sleep 10
# echo 'Setting up canary server...'
# ansible-playbook canaryConf.yml -i inventory

## Add
cd ../proxy
prodIp=`cat prodIp.txt`
canaryIp=`cat canaryIp.txt`
cd ../../App
git remote add production "root@"$prodIp":~/App"
git remote add canary "root@"$canaryIp":~/App"

echo 'Done...'