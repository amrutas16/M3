#!/bin/sh

# Spin up droplets
# node digitalocean.js

# sleep 12


# git remote remove production
# git remote remove canary
prodIp=`cat prodIp.txt`
canaryIp=`cat canaryIp.txt`
cd App
echo $prodIp
# git remote add production "root@"$prodIp":~/App"
# echo "root@"$prodIp":~/App" >> ../sample.txt
# git remote add canary "root@"$canaryIp":~/App"

cd ..
# ansible-playbook devConf.yml -i inventory
# ansible-playbook redisConf.yml -i inventory