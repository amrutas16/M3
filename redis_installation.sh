#!/bin/sh

# apt-get install make
# echo 'Installed make'
# apt-get install gcc
# echo 'Installed gcc'

# wget http://download.redis.io/releases/redis-3.2.5.tar.gz
# tar xzf redis-3.2.5.tar.gz
# cd redis-3.2.5
# echo 'Redis'
# ~/redis-3.2.5/make install
# echo 'Done'

sed -i 's/bind 127.0.0.1/bind 0.0.0.0/' ~/redis-*/redis.conf
