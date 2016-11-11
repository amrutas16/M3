var fs = require('fs');
var redis = require('redis')
var redisIp = fs.readFileSync('../prod/redisServer.txt', 'utf-8');
var client = redis.createClient(6379, redisIp, {});


var newIp = fs.readFileSync('newIp.txt', 'utf-8');

client.lpush("servers", "new:" + newIp);
